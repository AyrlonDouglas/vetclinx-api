import { UseCase } from '@common/core/useCase';
import { AddCommentDTO } from './addComment.dto';
import { DiscussionRepository } from '../../repositories/discussion.repository';
import Inspector, { InspectorError } from '@common/core/inspector';
import { Either, left, right } from '@common/core/either';
import AddCommentErrors from './addComment.errors';
import { Comment } from '@modules/discussion/domain/entities/comment/comment.entity';
import { ContextStorageService } from '@modules/shared/domain/contextStorage.service';
import { CommentRepository } from '../../repositories/comment.repository';
import { TransactionService } from '@modules/shared/domain/transaction.service';
import DiscussionErrors from '../discussion.errors';
// import { TransactionService } from '@modules/shared/domain/transaction.service';

type Output = Either<
  | InspectorError
  | InstanceType<(typeof DiscussionErrors)['DiscussionNotFoundError']>
  | InstanceType<(typeof AddCommentErrors)['ParentCommentNotFoundError']>
  | InstanceType<(typeof AddCommentErrors)['ParentCommetMustBeRootError']>,
  { id: string }
>;

export class AddCommentUseCase implements UseCase<AddCommentDTO, Output> {
  constructor(
    private readonly discussionRepository: DiscussionRepository,
    private readonly contextStorageService: ContextStorageService,
    private readonly commentRepository: CommentRepository,
    private readonly transactionService: TransactionService,
  ) {}

  async perform(input?: AddCommentDTO): Promise<Output> {
    const author = this.contextStorageService.get('currentUser');

    const inputOrFail = Inspector.againstFalsyBulk([
      { argument: author, argumentName: 'author' },
      { argument: input.content, argumentName: 'content' },
      { argument: input.discussionId, argumentName: 'discussionId' },
    ]);

    if (inputOrFail.isLeft()) {
      return left(inputOrFail.value);
    }

    const discussion = await this.discussionRepository.findById(
      input.discussionId,
    );
    if (!discussion) {
      return left(new DiscussionErrors.DiscussionNotFoundError());
    }

    let parentComment: Comment;
    if (input.parentCommentId) {
      parentComment = await this.commentRepository.findById(
        input.parentCommentId,
      );
      if (!parentComment) {
        return left(
          new AddCommentErrors.ParentCommentNotFoundError(
            input.parentCommentId,
          ),
        );
      }

      if (parentComment.props.parentCommentId) {
        return left(new AddCommentErrors.ParentCommetMustBeRootError());
      }

      if (parentComment.props.discussionId !== input.discussionId) {
        return left(
          new AddCommentErrors.ParentCommentDoesNotBelongToTheDiscussionError(),
        );
      }
    }

    const commentOrFail = Comment.create({
      authorId: author.props.id,
      content: input.content,
      discussionId: input.discussionId,
      parentCommentId: input.parentCommentId,
    });

    if (commentOrFail.isLeft()) {
      return left(commentOrFail.value);
    }

    const comment = commentOrFail.value;

    await this.transactionService.startTransaction();

    const commentCreated = await this.commentRepository.save(comment);

    if (parentComment) {
      parentComment.incrementCommentCount();
      this.commentRepository.save(parentComment);
    }

    discussion.incrementCommentCount();
    await this.discussionRepository.save(discussion);

    return right({ id: commentCreated });
  }
}
