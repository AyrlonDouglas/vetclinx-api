import { UseCase } from '@common/core/useCase';
import User from '@modules/user/domain/entities/user.entity';
import { UserRepository } from '../../repositories/user.repository';
import { GetUserByIdDTO } from './getUserById.dto';
import { Either, left, right } from '@common/core/either';
import Inspetor, { InspetorError } from '@common/core/inspetor';

type Response = Either<InspetorError, User | null>;

export default class GetUserByIdUseCase
  implements UseCase<GetUserByIdDTO, Response>
{
  constructor(private readonly userRepository: UserRepository) {}

  async perform(request?: GetUserByIdDTO): Promise<Response> {
    const { id } = request;

    const idValidate = Inspetor.againstFalsy(id, 'id');
    if (idValidate.isLeft()) {
      return left(idValidate.value);
    }

    const user = await this.userRepository.findById(id);

    return right(user);
  }
}
