import { UseCase } from 'src/shared/core/UseCase';
import { UserRepository } from '../../repositories/UserRepository';
import { CreateUserDTO } from './CreateUserDTO';
import User from '../../../domain/entities/User';
import Email, { EmailError } from '../../../domain/valueObjects/Email';
import CreateUserErrors from './CreateUserErrors';
import { Either, left, right } from '@shared/core/either';
import { InspetorError } from '@shared/core/Inspetor';

type Response = Either<
  | InspetorError
  | EmailError
  | InstanceType<(typeof CreateUserErrors)['emailAlreadyExistsError']>
  | InstanceType<(typeof CreateUserErrors)['usernameTakenError']>,
  void
>;

export default class CreateUserUseCase
  implements UseCase<CreateUserDTO, Response>
{
  constructor(private readonly userRepository: UserRepository) {}

  async perform(request: CreateUserDTO): Promise<Response> {
    const emailOrError = Email.create(request.email);

    if (emailOrError.isLeft()) {
      return left(emailOrError.value);
    }

    if (await this.userRepository.findByUsername(request.username)) {
      return left(new CreateUserErrors.usernameTakenError(request.username));
    }

    if (await this.userRepository.findByEmail(request.email)) {
      return left(new CreateUserErrors.emailAlreadyExistsError(request.email));
    }

    const createInput = {
      ...request,
      email: emailOrError.value,
    };

    const user = User.create(createInput);

    if (user.isLeft()) {
      return left(user.value);
    }

    await this.userRepository.save(user.value);

    return right();
  }
}
