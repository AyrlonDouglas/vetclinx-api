import { UseCase } from '@common/core/useCase';
import { RemoveCommentInput, RemoveCommentOutput } from './removeComment.dto';
import Inspetor from '@common/core/inspetor';
import { left, right } from '@common/core/either';
import { CommentRepository } from '../../repositories/comment.repository';
import { ContextStorageService } from '@modules/shared/domain/contextStorage.service';
import { RemoveCommentErrors } from './removeComment.errors';
import User from '@modules/user/domain/entities/user.entity';
import { DiscussionRepository } from '../../repositories/discussion.repository';

export class RemoveComment
  implements UseCase<RemoveCommentInput, RemoveCommentOutput>
{
  constructor(
    private readonly commentRepository: CommentRepository,
    private readonly context: ContextStorageService,
    private readonly discussionRepository: DiscussionRepository,
  ) {}

  async perform(input?: RemoveCommentInput): Promise<RemoveCommentOutput> {
    const inputOrFail = Inspetor.againstFalsyBulk([
      { argument: input.commentId, argumentName: 'commentId' },
      { argument: input.discussionId, argumentName: 'discussionId' },
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

    const currentUser = this.context.get('currentUser') as User;

    if (comment.props.authorId !== currentUser.props.id) {
      return left(new RemoveCommentErrors.OnlyCreatorCanRemoveError());
    }

    const deleteCount = await this.commentRepository.deleteById(
      input.commentId,
    );

    const discussion = await this.discussionRepository.findById(
      input.discussionId,
    );

    discussion.decrementCommentCount();

    await this.discussionRepository.save(discussion);

    return right({ deleted: !!deleteCount });
  }
}
