import { UseCase } from '@common/core/useCase';
import User from '@modules/user/domain/entities/user.entity';
import { UserRepository } from '../../repositories/user.repository';
import { GetUserByUsernameDTO } from './getUserByUsername.dto';
import { Either, left, right } from '@common/core/either';
import Inspetor, { InspetorError } from '@common/core/inspetor';
import UserErrors from '../user.errors';

type Response = Either<
  InspetorError | InstanceType<(typeof UserErrors)['UserNotFoundError']>,
  User
>;

export default class GetUserByUsernameUseCase
  implements UseCase<GetUserByUsernameDTO, Response>
{
  constructor(private readonly userRepository: UserRepository) {}

  async perform(request?: GetUserByUsernameDTO): Promise<Response> {
    const { username } = request;

    const usernameValidate = Inspetor.againstFalsy(username, 'username');
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
