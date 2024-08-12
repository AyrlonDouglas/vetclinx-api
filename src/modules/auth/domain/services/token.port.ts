import { Either } from '@shared/core/either';
import Token, { TokenError } from '../valueObjects/token/token.objectValue';

export default abstract class TokenPort {
  create: (input: TokenPortCreateInput) => Promise<Either<TokenError, Token>>;
  // verify: (token: string, secretKey: string) => void;
}

export type TokenPortCreateInput = {
  payload: any;
  secretKey?: string;
  config?: signConfig;
};

type signConfig = {
  expiresIn?: string;
  algorithm?: string;
};
