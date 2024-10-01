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

export class RemoveDiscussion
  implements UseCase<RemoveDiscussionInput, RemoveDiscussionOutput>
{
  constructor(
    private readonly discussionRepository: DiscussionRepository,
    private readonly commentRepository: CommentRepository,
    private readonly context: ContextStorageService,
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

    const discussionDeleted = await this.discussionRepository.deleteById(
      input.discussionId,
    );

    const commentsDeleteds = await this.commentRepository.deleteByDiscussionId(
      input.discussionId,
    );

    return right({
      deleted: !!discussionDeleted,
      commentDeletedCount: commentsDeleteds,
    });
  }
}
