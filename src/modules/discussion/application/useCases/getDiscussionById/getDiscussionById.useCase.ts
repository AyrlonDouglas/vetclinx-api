import { UseCase } from '@common/core/useCase';
import { getDiscussionByIdDTO } from './getDiscussionById.dto';
import Inspetor, { InspetorError } from '@common/core/inspetor';
import { Either, left, right } from '@common/core/either';
import { DiscussionRepository } from '../../repositories/discussion.repository';
import { Discussion } from '@modules/discussion/domain/entities/discussion/discussion.entity';

type Response = Either<InspetorError, Discussion | null>;
export class GetDiscussionByIdUseCase
  implements UseCase<getDiscussionByIdDTO, Response>
{
  constructor(private readonly discussionRepository: DiscussionRepository) {}

  async perform(request?: getDiscussionByIdDTO): Promise<Response> {
    const { id } = request;

    const idValidate = Inspetor.againstFalsy(id, 'id');
    if (idValidate.isLeft()) {
      return left(idValidate.value);
    }

    const discussion = await this.discussionRepository.findById(id);

    return right(discussion);
  }
}
