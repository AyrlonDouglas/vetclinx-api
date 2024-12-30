import { Either, left, right } from '@common/core/either';
import Inspetor, { InspetorError } from '@common/core/inspetor';
import { UseCase } from '@common/core/useCase';
import { UpdateDiscussionDTO } from './updateDiscussion.dto';
import { ContextStorageService } from '@modules/shared/domain/contextStorage.service';
import { DiscussionRepository } from '../../repositories/discussion.repository';
import UpdateDiscussionErrors from './updateDiscussion.errors';
import { Discussion } from '@modules/discussion/domain/entities/discussion/discussion.entity';

type Response = Either<
  | InspetorError
  | InstanceType<(typeof UpdateDiscussionErrors)['DiscussionNotFoundError']>,
  { id: string }
>;

export class UpdateDiscussionUseCase
  implements UseCase<UpdateDiscussionDTO, Response>
{
  constructor(
    private readonly context: ContextStorageService,
    private readonly discussionRepository: DiscussionRepository,
  ) {}

  async perform(request: UpdateDiscussionDTO): Promise<Response> {
    const idOrFail = Inspetor.againstFalsy(request.id, 'id');

    if (idOrFail.isLeft()) {
      return left(idOrFail.value);
    }

    const requestOrFail = Inspetor.atLeastOneTruthy([
      { argument: request.description, argumentName: 'description' },
      { argument: request.resolution, argumentName: 'resolution' },
      { argument: request.title, argumentName: 'title' },
    ]);

    if (requestOrFail.isLeft()) {
      return left(requestOrFail.value);
    }

    const discussion = await this.discussionRepository.findById(request.id);

    if (!discussion) {
      return left(
        new UpdateDiscussionErrors.DiscussionNotFoundError(request.id),
      );
    }

    const userId = this.context.get('currentUser').props.id;

    const authorId = discussion.props.authorId;

    if (authorId !== userId) {
      return left(new UpdateDiscussionErrors.OnlyCreatorCanUpdateError());
    }

    const discussionUpdatedOrFail = Discussion.create({
      resolution: request.resolution || discussion.props.resolution,
      description: request.description || discussion.props.description,
      title: request.title || discussion.props.title,
      authorId: discussion.props.authorId,
      createdAt: discussion.props.createdAt,
      downvotes: discussion.props.downvotes,
      id: discussion.props.id,
      upvotes: discussion.props.upvotes,
    });

    if (discussionUpdatedOrFail.isLeft()) {
      return left(discussionUpdatedOrFail.value);
    }

    const discussionUpdated =
      await this.discussionRepository.updateDiscussionById(
        request.id,
        discussionUpdatedOrFail.value,
      );

    return right({ id: discussionUpdated });
  }
}
