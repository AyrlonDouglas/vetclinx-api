import { UseCase } from '@common/core/useCase';
import {
  RemoveDiscussionInput,
  RemoveDiscussionOutput,
} from './removeDiscussion.dto';
import Inspetor from '@common/core/inspetor';
import { left, right } from '@common/core/either';
import { DiscussionRepository } from '../../repositories/discussion.repository';
import { CommentRepository } from '../../repositories/comment.repository';
import { RemoveDiscussionErrors } from './removeDiscussion.errors';
import { ContextStorageService } from '@modules/shared/domain/contextStorage.service';
import User from '@modules/user/domain/entities/user.entity';
import { VoteRepository } from '../../repositories/vote.repository';
import { TransactionService } from '@modules/shared/domain/transaction.service';

export class RemoveDiscussion
  implements UseCase<RemoveDiscussionInput, RemoveDiscussionOutput>
{
  constructor(
    private readonly discussionRepository: DiscussionRepository,
    private readonly commentRepository: CommentRepository,
    private readonly context: ContextStorageService,
    private readonly voteRepository: VoteRepository,
    private readonly transactionService: TransactionService,
  ) {}

  async perform(
    input?: RemoveDiscussionInput,
  ): Promise<RemoveDiscussionOutput> {
    const inputOrFail = Inspetor.againstFalsy(
      input.discussionId,
      'discussionId',
    );

    if (inputOrFail.isLeft()) {
      return left(inputOrFail.value);
    }

    const discussion = await this.discussionRepository.findById(
      input.discussionId,
    );

    if (!discussion) {
      return left(
        new RemoveDiscussionErrors.DiscussionNotFoundError(input.discussionId),
      );
    }

    const currentUser = this.context.get('currentUser') as User;

    if (discussion.props.authorId !== currentUser.props.id) {
      return left(new RemoveDiscussionErrors.OnlyCreatorCanDeleteError());
    }

    await this.transactionService.startTransaction();

    const discussionDeleted = await this.discussionRepository.deleteById(
      discussion.props.id,
    );

    const comments = await this.commentRepository.findByFilter({
      discussionId: discussion.props.id,
    });

    const commentsDeleteds = await this.commentRepository.deleteByDiscussionId(
      discussion.props.id,
    );

    const votesDeleteds = await this.voteRepository.deleteByVoteForReferency([
      discussion.props.id,
      ...comments.map((comment) => comment.props.id),
    ]);

    return right({
      deleted: !!discussionDeleted,
      commentDeletedCount: commentsDeleteds,
      voteDeletedCount: votesDeleteds,
    });
  }
}
