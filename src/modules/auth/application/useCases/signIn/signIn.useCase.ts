import { UseCase } from '@shared/core/useCase';
import Token from '@modules/auth/domain/valueObjects/token/token.objectValue';
import Credential from '@modules/auth/domain/valueObjects/credential/cretendital.valueObect';
import Email, {
  EmailError,
} from '@modules/user/domain/valueObjects/email/email.valueObject';
import Password, {
  PasswordError,
} from '@modules/user/domain/valueObjects/password/password.valueObject';
import { InspetorError } from '@shared/core/inspetor';
import { Either, left, right } from '@shared/core/either';
import AuthenticationService from '@modules/auth/domain/services/authentication/authentication.service';
import { SignInDTO } from './signIn.dto';

type Response = Either<InspetorError | EmailError | PasswordError, Token>;

// TODO: criar testes
// TODO: criar error de useCase

export default class SignInUseCase implements UseCase<SignInDTO, Response> {
  constructor(private readonly authenticationService: AuthenticationService) {}

  async perform(request?: SignInDTO): Promise<Response> {
    const emailOrError = Email.create(request.email);
    const passwordOrError = Password.create(request.password);

    if (emailOrError.isLeft()) {
      return left(emailOrError.value);
    }
    if (passwordOrError.isLeft()) {
      return left(passwordOrError.value);
    }

    const credentialOrError = Credential.create({
      email: emailOrError.value as Email,
      password: passwordOrError.value as Password,
    });

    if (credentialOrError.isLeft()) {
      return left(credentialOrError.value);
    }

    const signInOrError = await this.authenticationService.signIn(
      credentialOrError.value,
    );

    if (signInOrError.isLeft()) {
      return left(signInOrError.value);
    }

    return right(signInOrError.value);
  }
}
