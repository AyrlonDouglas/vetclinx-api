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
  | InstanceType<(typeof UpdateDiscussionErrors)['DiscussionNotFoundError']>
  | InstanceType<(typeof UpdateDiscussionErrors)['OnlyCreatorCanDeleteError']>,
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

    const userId = this.context.get('currentUser').props.id;
    const discussion = await this.discussionRepository.findById(request.id);

    if (!discussion) {
      return left(
        new UpdateDiscussionErrors.DiscussionNotFoundError(request.id),
      );
    }

    if (discussion.props.authorId !== userId) {
      return left(new UpdateDiscussionErrors.OnlyCreatorCanUpdateError());
    }

    const discussionUpdatedOrFail = Discussion.create({
      authorId: discussion.props.authorId,
      description: request.description || discussion.props.description,
      title: request.title || discussion.props.title,
      comments: discussion.props.comments,
      createdAt: discussion.props.createdAt,
      downvotes: discussion.props.downvotes,
      id: discussion.props.id,
      resolution: request.resolution || discussion.props.resolution,
      upvotes: discussion.props.upvotes,
    });

    if (discussionUpdatedOrFail.isLeft()) {
      return left(discussionUpdatedOrFail.value);
    }

    const discussionUpdated = await this.discussionRepository.save(
      discussionUpdatedOrFail.value,
    );

    return right({ id: discussionUpdated });
  }
}
