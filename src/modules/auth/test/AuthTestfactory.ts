import User from '@modules/user/domain/entities/user.entity';
import Email from '@modules/user/domain/valueObjects/email/email.valueObject';
import FakeUserRepository from '@modules/user/infra/repositories/fakeUser.repository';
import Credential from '../domain/valueObjects/credential/credential.valueObject';
import { Config } from '@modules/config/ports/config';
import { UserRepository } from '@modules/user/application/repositories/user.repository';
import JWTTokenService from '../../shared/infra/token/jwtToken.service';
import AuthenticationService from '../domain/services/authentication/authentication.service';
import TokenService from '../../shared/domain/token.service';
import HashService from '@modules/shared/domain/hash.service';
import BcryptHashService from '@modules/shared/infra/hash/bcrytHash.service';
import PasswordFactory from '@modules/user/domain/valueObjects/password/password.factory';
import Password from '@modules/user/domain/valueObjects/password/password.valueObject';

export default class AuthTestFactory {
  userRepository: UserRepository;
  validCredential: Credential;
  config: Config;
  tokenService: TokenService;
  authenticationService: AuthenticationService;
  hashService: HashService;
  passwordFactory: PasswordFactory;

  constructor() {}

  async prepare() {
    this.hashService = new BcryptHashService();
    this.passwordFactory = new PasswordFactory(this.hashService);

    const emailMock = Email.create('teste@teste.com');
    if (emailMock.isLeft()) throw new Error('email fail');

    const pass = 'SenhaForte54!';
    const passwordRawMock = Password.create(pass);
    if (passwordRawMock.isLeft()) throw new Error('passwordRawMock fail');

    const hashedPass = await this.passwordFactory.create(pass);
    if (hashedPass.isLeft()) throw new Error('hashedPass fail');

    const userMock = User.create({
      name: 'Ayrlon',
      email: emailMock.value,
      password: hashedPass.value,
      username: 'ayrlon',
    });

    this.userRepository = new FakeUserRepository();
    this.userRepository.save(userMock.value as User);

    this.validCredential = Credential.create({
      email: emailMock.value,
      password: passwordRawMock.value,
    }).value as Credential;

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
      this.hashService,
    );

    return this;
  }
}
