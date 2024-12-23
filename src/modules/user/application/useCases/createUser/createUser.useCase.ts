import { UseCase } from '@common/core/useCase';
import { UserRepository } from '@modules/user/application/repositories/user.repository';
import { CreateUserDTO } from './createUser.dto';
import User from '@modules/user/domain/entities/user.entity';
import Email, {
  EmailError,
} from '@modules/user/domain/valueObjects/email/email.valueObject';
import CreateUserErrors from './createUser.errors';
import { Either, left, right } from '@common/core/either';
import { InspetorError } from '@common/core/inspetor';
import PasswordFactory from '@modules/user/domain/valueObjects/password/password.factory';

type Response = Either<
  | InspetorError
  | EmailError
  | InstanceType<(typeof CreateUserErrors)['EmailAlreadyExistsError']>
  | InstanceType<(typeof CreateUserErrors)['UsernameTakenError']>,
  { id: string }
>;
export default class CreateUserUseCase
  implements UseCase<CreateUserDTO, Response>
{
  constructor(
    private readonly userRepository: UserRepository,
    private readonly passwordFactory: PasswordFactory,
  ) {}

  async perform(request: CreateUserDTO): Promise<Response> {
    const emailOrError = Email.create(request.email);
    if (emailOrError.isLeft()) {
      return left(emailOrError.value);
    }

    const passwordOrError = await this.passwordFactory.create(request.password);

    if (passwordOrError.isLeft()) {
      return left(passwordOrError.value);
    }
    if (await this.userRepository.findByUsername(request.username)) {
      return left(new CreateUserErrors.UsernameTakenError(request.username));
    }

    if (await this.userRepository.findByEmail(request.email)) {
      return left(new CreateUserErrors.EmailAlreadyExistsError(request.email));
    }

    const createInput = {
      ...request,
      email: emailOrError.value,
      password: passwordOrError.value,
    };

    const user = User.create(createInput);

    if (user.isLeft()) {
      return left(user.value);
    }

    const userId = await this.userRepository.save(user.value);

    return right({ id: userId });
  }
}
