import { UserRepository } from '@modules/user/application/repositories/user.repository';
import Credential from '../../valueObjects/credential/credential.valueObject';
import { Either, left, right } from '@common/core/either';
import TokenService from '../../../../shared/domain/token.service';
import Token, { TokenError } from '../../valueObjects/token/token.valueObject';
import { Config } from '@modules/config/ports/config';
import AuthenticationErros from './authentication.errors';
import HashService from '@modules/shared/domain/hash.service';

type signInResponse = Either<
  | TokenError
  | InstanceType<(typeof AuthenticationErros)['InvalidCredentialError']>
  | null,
  Token
>;

export default class AuthenticationService {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly tokenService: TokenService,
    private readonly config: Config,
    private readonly hashService: HashService,
  ) {}

  async signIn(credential: Credential): Promise<signInResponse> {
    const user = await this.userRepository.findByEmail(
      credential.props.email.value,
    );

    if (!user) {
      return left(new AuthenticationErros.InvalidCredentialError());
    }

    const passMatch = await this.hashService.compare(
      credential.props.password.value,
      user.props.password.value,
    );

    if (!passMatch) {
      return left(new AuthenticationErros.InvalidCredentialError());
    }

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password, ...userData } = user.props;

    const payload = { user: userData };
    const authConfig = this.config.getAuthenticationConfig();

    const tokenOrError = await this.tokenService.create({
      payload,
      secretKey: authConfig.secretKey,
      config: { expiresIn: authConfig.expiresIn },
    });

    if (tokenOrError.isLeft()) {
      return left(tokenOrError.value);
    }

    return right(tokenOrError.value);
  }
}
