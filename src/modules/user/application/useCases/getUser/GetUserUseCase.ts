import { UseCase } from 'src/shared/core/UseCase';
import User from '../../../domain/entities/User';
import { UserRepository } from '../../repositories/UserRepository';
import GetUserErrors from './GetUserErrors';
import { GetUserDTO } from './GetUserDTO';
import { Either, left, right } from '@shared/core/either';
import Inspetor, { InspetorError } from '@shared/core/Inspetor';

type Response = Either<InspetorError, User | null>;

export default class GetUserUseCase implements UseCase<GetUserDTO, Response> {
  constructor(private readonly userRepository: UserRepository) {}

  async perform(request?: GetUserDTO): Promise<Response> {
    const { username } = request;

    const usernameValidate = Inspetor.againstFalsy(username, 'username');
    if (usernameValidate.isLeft()) {
      return left(usernameValidate.value);
    }

    const user = await this.userRepository.findByUsername(username);

    if (!user) {
      return left(new GetUserErrors.userNotFoundError(username));
    }

    return right(user);
  }
}
