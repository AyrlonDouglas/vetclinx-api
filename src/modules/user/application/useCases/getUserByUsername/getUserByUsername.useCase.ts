import { UseCase } from '@common/core/useCase';
import User from '@modules/user/domain/entities/user.entity';
import { UserRepository } from '../../repositories/user.repository';
import { GetUserByUsernameDTO } from './getUserByUsername.dto';
import { Either, left, right } from '@common/core/either';
import Inspector, { InspectorError } from '@common/core/inspector';
import UserErrors from '../user.errors';

type Response = Either<
  InspectorError | InstanceType<(typeof UserErrors)['UserNotFoundError']>,
  User
>;

export default class GetUserByUsernameUseCase
  implements UseCase<GetUserByUsernameDTO, Response>
{
  constructor(private readonly userRepository: UserRepository) {}

  async perform(request?: GetUserByUsernameDTO): Promise<Response> {
    const { username } = request;

    const usernameValidate = Inspector.againstFalsy(username, 'username');
    if (usernameValidate.isLeft()) {
      return left(usernameValidate.value);
    }
    const user = await this.userRepository.findByUsername(username);

    if (!user) {
      return left(new UserErrors.UserNotFoundError());
    }

    return right(user);
  }
}
