import { Either } from '@common/core/either';
import Token, {
  TokenError,
} from '../../auth/domain/valueObjects/token/token.valueObject';

// TODO: Levar esse serviço pro módulo de auth (Maior sentido estar lá)
export default abstract class TokenService {
  create: (
    input: TokenServiceCreateInput,
  ) => Promise<Either<TokenError, Token>>;
  verifyAsync: (
    input: TokenServiceVerifyAsyncInput,
  ) => Promise<VerifyAsyncResult>;
}

export type PayloadToken = { userId: string };

export type TokenServiceCreateInput = {
  payload: PayloadToken;
  secretKey?: string;
  config?: signConfig;
};

type signConfig = {
  expiresIn?: string;
  algorithm?: string;
};

export type TokenServiceVerifyAsyncInput = {
  token: string;
  secretKey: string;
};

export type VerifyAsyncResult = Either<Error, PayloadToken>;
