import { UseCase } from '@common/core/useCase';
import { RemoveUserByIdDTO } from './removeUserById.dto';
import { UserRepository } from '../../repositories/user.repository';
import Inspetor, { InspetorError } from '@common/core/inspetor';
import { Either, left, right } from '@common/core/either';

type Response = Either<InspetorError, string>;

export default class RemoveUserByIdUseCase
  implements UseCase<RemoveUserByIdDTO, Response>
{
  constructor(private readonly userRepository: UserRepository) {}
  async perform(request?: RemoveUserByIdDTO): Promise<Response> {
    const { id } = request;

    const idValidate = Inspetor.againstFalsy(id, 'id');

    if (idValidate.isLeft()) {
      return left(idValidate.value);
    }

    const removedUser = await this.userRepository.removeById(id);

    return right(removedUser);
  }
}
