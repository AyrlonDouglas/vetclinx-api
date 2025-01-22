import { UseCase } from '@common/core/useCase';
import { VoteOnCommentInput, VoteOnCommentOutput } from './voteOnComment.dto';
import Inspetor from '@common/core/inspetor';
import { left, right } from '@common/core/either';
import { VoteTypes } from '@modules/discussion/domain/component/voteManager.component';
import { CommentRepository } from '../../repositories/comment.repository';
import { ContextStorageService } from '@modules/shared/domain/contextStorage.service';
import { VoteOnCommentError } from './voteOnComment.errors';
import { TransactionService } from '@modules/shared/domain/transaction.service';
import { CommentVoteRepository } from '../../repositories/commentVote.repository';
import { CommentVote } from '@modules/discussion/domain/entities/vote/commentVote.entity';

export class VoteOnComment
  implements UseCase<VoteOnCommentInput, VoteOnCommentOutput>
{
  constructor(
    private readonly commentRepository: CommentRepository,
    private readonly commentvoteRepository: CommentVoteRepository,
    private readonly context: ContextStorageService,
    private readonly transactionService: TransactionService,
  ) {}

  async perform(input?: VoteOnCommentInput): Promise<VoteOnCommentOutput> {
    const inputOrFail = Inspetor.againstFalsyBulk([
      { argument: input.commentId, argumentName: 'commentId' },
      { argument: input.voteType, argumentName: 'voteType' },
    ]);

    if (inputOrFail.isLeft()) {
      return left(inputOrFail.value);
    }

    const isOneOfOrFail = Inspetor.isOneOf(
      input.voteType,
      Object.values(VoteTypes),
      'voteType',
    );

    if (isOneOfOrFail.isLeft()) {
      return left(isOneOfOrFail.value);
    }

    const comment = await this.commentRepository.findById(input.commentId);

    if (!comment) {
      return left(new VoteOnCommentError.CommentNotFoundError(input.commentId));
    }

    const currentUser = this.context.get('currentUser');

    if (comment.props.authorId === currentUser.props.id) {
      return left(new VoteOnCommentError.CreatorCannotVoteYourComment());
    }

    const existingVote = await this.commentvoteRepository.findOneByFilter({
      authorId: currentUser.props.id,
      commentId: comment.props.id,
    });

    await this.transactionService.startTransaction();

    if (existingVote) {
      if (existingVote.props.voteType === input.voteType) {
        comment.removeVote(existingVote);
        await this.commentvoteRepository.deleteById(existingVote.props.id);
      } else {
        const from = existingVote.props.voteType;
        const to = from === VoteTypes.down ? VoteTypes.up : VoteTypes.down;
        comment.exchangeVote(from, to);
        existingVote.setVoteType(to);
        await this.commentvoteRepository.save(existingVote);
      }
    } else {
      const newVote = CommentVote.create({
        authorId: currentUser.props.id,
        voteType: input.voteType,
        commentId: comment.props.id,
      });

      if (newVote.isLeft()) {
        return left(newVote.value);
      } else {
        await this.commentvoteRepository.save(newVote.value);
      }

      if (input.voteType === VoteTypes.up) {
        comment.upvote();
      } else {
        comment.downvote();
      }
    }

    const commentUpdated = await this.commentRepository.save(comment);

    return right({ id: commentUpdated });
  }
}
