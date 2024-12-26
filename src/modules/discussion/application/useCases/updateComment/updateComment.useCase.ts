import { UseCase } from '@common/core/useCase';
import { UpdateCommentInput, UpdateCommentOutput } from './updateComment.dto';
import Inspetor from '@common/core/inspetor';
import { left, right } from '@common/core/either';
import { CommentRepository } from '../../repositories/comment.repository';
import { UpdateCommentErrors } from './updateComment.errors';
import { ContextStorageService } from '@modules/shared/domain/contextStorage.service';
import { Comment } from '@modules/discussion/domain/entities/comment/comment.entity';

export class UpdateComment
  implements UseCase<UpdateCommentInput, UpdateCommentOutput>
{
  constructor(
    private readonly commentRepository: CommentRepository,
    private readonly context: ContextStorageService,
  ) {}

  async perform(input: UpdateCommentInput): Promise<UpdateCommentOutput> {
    const inputOrFail = Inspetor.againstFalsyBulk([
      { argument: input.commentId, argumentName: 'commentId' },
      { argument: input.content, argumentName: 'content' },
    ]);

    if (inputOrFail.isLeft()) {
      return left(inputOrFail.value);
    }

    const comment = await this.commentRepository.findById(input.commentId);

    if (!comment) {
      return left(
        new UpdateCommentErrors.CommentNotFoundError(input.commentId),
      );
    }

    const userId = this.context.currentUser.props.id;

    const authorId = comment.props.authorId;

    if (authorId !== userId) {
      return left(new UpdateCommentErrors.OnlyCreatorCanUpdateError());
    }

    const commentToUpdateOrFail = Comment.create({
      authorId,
      content: input.content,
      discussionId: comment.props.discussionId,
      createdAt: comment.props.createdAt,
      downvotes: comment.props.downvotes,
      id: comment.props.id,
      updatedAt: comment.props.updatedAt,
      upvotes: comment.props.upvotes,
    });

    if (commentToUpdateOrFail.isLeft()) {
      return left(commentToUpdateOrFail.value);
    }
    const commentToUpdate = commentToUpdateOrFail.value;
    const commentUpdatedId = await this.commentRepository.save(commentToUpdate);

    return right({ id: commentUpdatedId });
  }
}
