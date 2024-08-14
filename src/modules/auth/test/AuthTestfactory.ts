import User from '@modules/user/domain/entities/user.entity';
import Email from '@modules/user/domain/valueObjects/email/email.valueObject';
import Password from '@modules/user/domain/valueObjects/password/password.valueObject';
import FakeUserRepository from '@modules/user/infra/repositories/fakeUser.repository';
import Credential from '../domain/valueObjects/credential/credential.valueObject';
import { Config } from '@modules/config/ports/config';
import { UserRepository } from '@modules/user/application/repositories/user.repository';
import JWTTokenService from '../infra/services/token/token.service';
import AuthenticationService from '../domain/services/authentication/authentication.service';
import TokenService from '../domain/services/token.service';

export default class AuthTestFactory {
  userRepository: UserRepository;
  validCredential: Credential;
  config: Config;
  tokenService: TokenService;
  authenticationService: AuthenticationService;

  constructor() {
    const emailMock = Email.create('teste@teste.com');
    const passwordMock = Password.create('SenhaForte54!');

    const userMock = User.create({
      name: 'Ayrlon',
      email: emailMock.value as Email,
      password: passwordMock.value as Password,
      username: 'ayrlon',
    });

    this.userRepository = new FakeUserRepository([userMock.value as User]);

    this.validCredential = Credential.create({
      email: emailMock.value as Email,
      password: passwordMock.value as Password,
    }).value as Credential;

    // const invalidCredential = Credential.create({
    //   email: Email.create('teste@teste.com').value as Email,
    //   password: Password.create('SinvalidForte12@!').value as Password,
    // }).value as Credential;

    // const invalidCredential2 = Credential.create({
    //   email: Email.create('invalid@testeteste.com.br').value as Email,
    //   password: Password.create('SenhaForte54!').value as Password,
    // }).value as Credential;

    this.config = {
      getAuthenticationConfig: () => ({
        secretKey: 'secretKey',
        expiresIn: '1h',
      }),
    } as Config;

    this.tokenService = new JWTTokenService();

    this.authenticationService = new AuthenticationService(
      this.userRepository,
      this.tokenService,
      this.config,
    );
  }
}
