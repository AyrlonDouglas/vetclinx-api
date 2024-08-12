import { UserRepository } from '@modules/user/application/repositories/user.repository';
import Credential from '../valueObjects/credential/cretendital.valueObect';
import { Either, left, right } from '@shared/core/either';
import TokenPort from './token.port';
import Token from '../valueObjects/token/token.objectValue';
import { Config } from '@modules/config/ports/config';

type signInResponse = Either<Error | null, Token>;

// TODO: criar testes
export default class AuthenticationService {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly tokenService: TokenPort,
    private readonly config: Config,
  ) {}

  async signIn(credential: Credential): Promise<signInResponse> {
    const user = await this.userRepository.findByEmail(
      credential.props.email.value,
    );

    // TODO: verificar senha se bate!
    if (
      !user ||
      user.props.password.value !== credential.props.password.value
    ) {
      return left(new Error('Invalid credential1'));
    }

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password, ...userData } = user.props;

    const tokenData = { user: userData };
    const secretKey = this.config.getAuthenticationConfig().secretKey;

    const tokenOrError = this.tokenService.create(tokenData, secretKey);

    if (tokenOrError.isLeft()) {
      return left(tokenOrError.value);
    }

    return right(tokenOrError.value);
  }
}
