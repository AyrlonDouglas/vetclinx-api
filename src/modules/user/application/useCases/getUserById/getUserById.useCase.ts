import { UseCase } from '@common/core/useCase';
import { UserRepository } from '../../repositories/user.repository';
import { GetUserByIdDTO } from './getUserById.dto';
import { Either, left, right } from '@common/core/either';
import Inspector, { InspectorError } from '@common/core/inspector';
import User from '@modules/user/domain/entities/user.entity';
import UserErrors from '../user.errors';
type Response = Either<
  InspectorError | InstanceType<(typeof UserErrors)['UserNotFoundError']>,
  User
>;

export default class GetUserByIdUseCase
  implements UseCase<GetUserByIdDTO, Response>
{
  constructor(private readonly userRepository: UserRepository) {}

  async perform(request?: GetUserByIdDTO): Promise<Response> {
    const { id } = request;

    const idValidate = Inspector.againstFalsy(id, 'id');
    if (idValidate.isLeft()) {
      return left(idValidate.value);
    }

    const user = await this.userRepository.findById(id);

    if (!user) {
      return left(new UserErrors.UserNotFoundError());
    }

    return right(user);
  }
}
