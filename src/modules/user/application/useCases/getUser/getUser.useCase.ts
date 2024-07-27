import { UseCase } from '@shared/core/useCase';
import User from '../../../domain/entities/user.entity';
import { UserRepository } from '../../repositories/user.repository';
import { GetUserDTO } from './getUser.dto';
import { Either, left, right } from '@shared/core/either';
import Inspetor, { InspetorError } from '@shared/core/inspetor';

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

    return right(user);
  }
}
