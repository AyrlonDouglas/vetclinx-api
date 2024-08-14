import { Either } from '@common/core/either';
import Token, {
  TokenError,
} from '../../auth/domain/valueObjects/token/token.objectValue';

export default abstract class TokenService {
  create: (
    input: TokenServiceCreateInput,
  ) => Promise<Either<TokenError, Token>>;
  // verify: (token: string, secretKey: string) => void;
}

export type TokenServiceCreateInput = {
  payload: any;
  secretKey?: string;
  config?: signConfig;
};

type signConfig = {
  expiresIn?: string;
  algorithm?: string;
};
