import { UserRepository } from '@modules/user/application/repositories/user.repository';
import Credential from '../../valueObjects/credential/credential.valueObject';
import { Either, left, right } from '@shared/core/either';
import TokenService from '../token.service';
import Token from '../../valueObjects/token/token.objectValue';
import { Config } from '@modules/config/ports/config';
import AuthenticationErros from './authentication.errors';

type signInResponse = Either<Error | null, Token>;

export default class AuthenticationService {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly tokenService: TokenService,
    private readonly config: Config,
  ) {}

  async signIn(credential: Credential): Promise<signInResponse> {
    const user = await this.userRepository.findByEmail(
      credential.props.email.value,
    );
    if (
      !user ||
      user.props.password.value !== credential.props.password.value
    ) {
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
