import { UseCase } from '@common/core/useCase';
import { AddCommentDTO } from './addComment.dto';
import { DiscussionRepository } from '../../repositories/discussion.repository';
import Inspetor, { InspetorError } from '@common/core/inspetor';
import { Either, left, right } from '@common/core/either';
import AddCommentErrors from './addComment.errors';
import { Comment } from '@modules/discussion/domain/entities/comment/comment.entity';

type Output = Either<
  | InspetorError
  | InstanceType<(typeof AddCommentErrors)['DiscussionNotFoundError']>,
  { id: string }
>;

export class AddCommentUseCase implements UseCase<AddCommentDTO, Output> {
  constructor(private readonly discussionRepository: DiscussionRepository) {}
  async perform(input?: AddCommentDTO): Promise<Output> {
    const inputOrFail = Inspetor.againstFalsyBulk([
      { argument: input.author, argumentName: 'author' },
      { argument: input.content, argumentName: 'content' },
      { argument: input.discussion, argumentName: 'discussion' },
    ]);

    if (inputOrFail.isLeft()) {
      return left(inputOrFail.value);
    }

    const discussion = await this.discussionRepository.findById(
      input.discussion,
    );

    if (!discussion) {
      return left(
        new AddCommentErrors.DiscussionNotFoundError(input.discussion),
      );
    }

    const commentOrFail = Comment.create({
      author: input.author,
      content: input.content,
      discussion: input.discussion,
    });

    if (commentOrFail.isLeft()) {
      return left(commentOrFail.value);
    }

    const comment = commentOrFail.value;

    discussion.addComment(comment);

    const discussionUpdated =
      await this.discussionRepository.updateDiscussionById(
        input.discussion,
        discussion,
      );

    return right({ id: discussionUpdated });
  }
}
