import { UseCase } from '@common/core/useCase';
import { getDiscussionByIdDTO } from './getDiscussionById.dto';
import Inspector, { InspectorError } from '@common/core/inspector';
import { Either, left, right } from '@common/core/either';
import { DiscussionRepository } from '../../repositories/discussion.repository';
import { Discussion } from '@modules/discussion/domain/entities/discussion/discussion.entity';
import DiscussionErrors from '../discussion.errors';

type Response = Either<
  | InspectorError
  | InstanceType<(typeof DiscussionErrors)['DiscussionNotFoundError']>,
  Discussion
>;
export class GetDiscussionByIdUseCase
  implements UseCase<getDiscussionByIdDTO, Response>
{
  constructor(private readonly discussionRepository: DiscussionRepository) {}

  async perform(request?: getDiscussionByIdDTO): Promise<Response> {
    const { id } = request;

    const idValidate = Inspector.againstFalsy(id, 'id');
    if (idValidate.isLeft()) {
      return left(idValidate.value);
    }

    const discussion = await this.discussionRepository.findById(id);

    if (!discussion) {
      return left(new DiscussionErrors.DiscussionNotFoundError());
    }

    return right(discussion);
  }
}
