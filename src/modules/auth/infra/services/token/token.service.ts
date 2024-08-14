import * as jwt from 'jsonwebtoken';
import { Either, left, right } from '@shared/core/either';
import Inspetor from '@shared/core/inspetor';
import TokenService, {
  TokenServiceCreateInput,
} from '@modules/auth/domain/services/token.service';
import Token, {
  TokenError,
} from '@modules/auth/domain/valueObjects/token/token.objectValue';
import TokenServiceErrors from './token.service.errors';

export default class JWTTokenService implements TokenService {
  async create(
    input: TokenServiceCreateInput,
  ): Promise<Either<TokenError, Token>> {
    const inputOrError = Inspetor.againstFalsyBulk([
      { argument: input.payload, argumentName: 'payload' },
      { argument: input.secretKey, argumentName: 'secretKey' },
    ]);

    if (inputOrError.isLeft()) {
      return left(
        new TokenServiceErrors.InvalidInputError(inputOrError.value.message),
      );
    }

    const tokenData = jwt.sign(input.payload, input.secretKey, {
      expiresIn: input.config.expiresIn,
    });

    const token = Token.create({
      token: tokenData,
      expiresIn: input.config.expiresIn,
    });

    if (token.isLeft()) {
      return left(token.value);
    }

    return right(token.value);
  }
}
