import { UseCase } from '@common/core/useCase';
import { AddCommentDTO } from './addComment.dto';
import { DiscussionRepository } from '../../repositories/discussion.repository';
import Inspetor, { InspetorError } from '@common/core/inspetor';
import { Either, left, right } from '@common/core/either';
import AddCommentErrors from './addComment.errors';
import { Comment } from '@modules/discussion/domain/entities/comment/comment.entity';
import { ContextStorageService } from '@modules/shared/domain/contextStorage.service';
import User from '@modules/user/domain/entities/user.entity';
import { CommentRepository } from '../../repositories/comment.repository';
// import { TransactionService } from '@modules/shared/domain/transaction.service';

type Output = Either<
  | InspetorError
  | InstanceType<(typeof AddCommentErrors)['DiscussionNotFoundError']>,
  { id: string }
>;

export class AddCommentUseCase implements UseCase<AddCommentDTO, Output> {
  constructor(
    private readonly discussionRepository: DiscussionRepository,
    private readonly contextStorageService: ContextStorageService,
    private readonly commentRepository: CommentRepository,
    // private readonly transactionService: TransactionService,
  ) {}

  async perform(input?: AddCommentDTO): Promise<Output> {
    // await this.transactionService.startTransaction();
    const author = this.contextStorageService.get('currentUser') as User;

    const inputOrFail = Inspetor.againstFalsyBulk([
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
      return left(
        new AddCommentErrors.DiscussionNotFoundError(input.discussionId),
      );
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
