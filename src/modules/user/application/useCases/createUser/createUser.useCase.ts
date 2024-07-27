import { UseCase } from '@shared/core/useCase';
import { UserRepository } from '../../repositories/user.repository';
import { CreateUserDTO } from './createUser.dto';
import User from '../../../domain/entities/user.entity';
import Email, {
  EmailError,
} from '../../../domain/valueObjects/email.valueObject';
import CreateUserErrors from './createUser.errors';
import { Either, left, right } from '@shared/core/either';
import { InspetorError } from '@shared/core/inspetor';

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