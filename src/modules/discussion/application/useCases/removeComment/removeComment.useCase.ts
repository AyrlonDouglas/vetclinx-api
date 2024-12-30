import { UseCase } from '@common/core/useCase';
import { RemoveCommentInput, RemoveCommentOutput } from './removeComment.dto';
import Inspetor from '@common/core/inspetor';
import { left, right } from '@common/core/either';
import { CommentRepository } from '../../repositories/comment.repository';
import { ContextStorageService } from '@modules/shared/domain/contextStorage.service';
import { RemoveCommentErrors } from './removeComment.errors';
import { DiscussionRepository } from '../../repositories/discussion.repository';
import { TransactionService } from '@modules/shared/domain/transaction.service';
import { CommentVoteRepository } from '../../repositories/commentVote.repository';

export class RemoveComment
  implements UseCase<RemoveCommentInput, RemoveCommentOutput>
{
  constructor(
    private readonly commentRepository: CommentRepository,
    private readonly context: ContextStorageService,
    private readonly discussionRepository: DiscussionRepository,
    private readonly commentVoteRepository: CommentVoteRepository,
    private readonly transactionService: TransactionService,
  ) {}

  async perform(input?: RemoveCommentInput): Promise<RemoveCommentOutput> {
    const inputOrFail = Inspetor.againstFalsyBulk([
      { argument: input.commentId, argumentName: 'commentId' },
    ]);

    if (inputOrFail.isLeft()) {
      return left(inputOrFail.value);
    }

    const comment = await this.commentRepository.findById(input.commentId);

    if (!comment) {
      return left(
        new RemoveCommentErrors.CommentNotFoundError(input.commentId),
      );
    }

    const currentUser = this.context.get('currentUser');

    if (comment.props.authorId !== currentUser.props.id) {
      return left(new RemoveCommentErrors.OnlyCreatorCanRemoveError());
    }

    await this.transactionService.startTransaction();

    const childrenDeleteCount =
      await this.commentRepository.deleteByParentCommentId(input.commentId);

    const voteDeletedCount = await this.commentVoteRepository.deleteByCommentId(
      [comment.props.id],
    );

    const deleteCount = await this.commentRepository.deleteById(
      comment.props.id,
    );

    if (deleteCount) {
      const discussion = await this.discussionRepository.findById(
        comment.props.discussionId,
      );

      discussion.decrementCommentCount();

      await this.discussionRepository.save(discussion);

      if (comment.props.parentCommentId) {
        const parentComment = await this.commentRepository.findById(
          comment.props.parentCommentId,
        );
        parentComment.decrementCommentCount();
        await this.commentRepository.save(parentComment);
      }

      // TODO: precisa apagar os votos dos comentários filhos!!! adicionar a remoção em uma fila ?
    }

    return right({
      deleted: !!deleteCount,
      count: childrenDeleteCount + deleteCount,
      voteDeletedCount,
    });
  }
}
