import { UseCase } from '@common/core/useCase';
import { CreateDiscussionDTO } from './createDiscussion.dto';
import { Discussion } from '@modules/discussion/domain/entities/discussion/discussion.entity';
import { ContextStorageService } from '@modules/shared/domain/contextStorage.service';
import { Either, left, right } from '@common/core/either';
import { InspetorError } from '@common/core/inspetor';
import { DiscussionRepository } from '../../repositories/discussion.repository';

type Response = Either<InspetorError, { id: string }>;
export class CreateDiscussionUseCase
  implements UseCase<CreateDiscussionDTO, Response>
{
  constructor(
    private readonly contextStorageService: ContextStorageService,
    private readonly discussionRepository: DiscussionRepository,
  ) {}

  async perform(request: CreateDiscussionDTO): Promise<Response> {
    const authorId = this.contextStorageService.get('currentUser').props.id;

    const discussionOrFail = Discussion.create({
      authorId,
      description: request.description,
      title: request.title,
    });

    if (discussionOrFail.isLeft()) {
      return left(discussionOrFail.value);
    }

    const discussionSaved = await this.discussionRepository.save(
      discussionOrFail.value,
    );

    return right({ id: discussionSaved });
  }
}
