import { UseCase } from '@common/core/useCase';
import Token from '@modules/auth/domain/valueObjects/token/token.valueObject';
import Credential from '@modules/auth/domain/valueObjects/credential/credential.valueObject';
import Email, {
  EmailError,
} from '@modules/user/domain/valueObjects/email/email.valueObject';
import { InspetorError } from '@common/core/inspetor';
import { Either, left, right } from '@common/core/either';
import AuthenticationService from '@modules/auth/domain/services/authentication/authentication.service';
import { SignInDTO } from './signIn.dto';
import SignInError from './signIn.errors';
import PasswordErrors from '@modules/user/domain/valueObjects/password/password.errors';
import Password from '@modules/user/domain/valueObjects/password/password.valueObject';

type Response = Either<
  | InspetorError
  | EmailError
  | InstanceType<(typeof PasswordErrors)['InvalidPasswordError']>,
  Token
>;

export default class SignInUseCase implements UseCase<SignInDTO, Response> {
  constructor(private readonly authenticationService: AuthenticationService) {}

  async perform(request?: SignInDTO): Promise<Response> {
    const emailOrError = Email.create(request.email);
    const passwordOrError = Password.create(request.password);

    if (emailOrError.isLeft()) {
      return left(new SignInError.UnauthorizedError());
    }
    if (passwordOrError.isLeft()) {
      return left(new SignInError.UnauthorizedError());
    }

    const credentialOrError = Credential.create({
      email: emailOrError.value,
      password: passwordOrError.value,
    });

    if (credentialOrError.isLeft()) {
      return left(new SignInError.UnauthorizedError());
    }

    const signInOrError = await this.authenticationService.signIn(
      credentialOrError.value,
    );

    if (signInOrError.isLeft()) {
      return left(new SignInError.UnauthorizedError());
    }

    return right(signInOrError.value);
  }
}
