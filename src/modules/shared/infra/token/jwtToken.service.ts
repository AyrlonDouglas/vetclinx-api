import * as jwt from 'jsonwebtoken';
import { Either, left, right } from '@common/core/either';
import Inspetor from '@common/core/inspetor';
import TokenService, {
  TokenServiceCreateInput,
} from '@modules/shared/domain/token.service';
import Token, {
  TokenError,
} from '@modules/auth/domain/valueObjects/token/token.valueObject';
import TokenServiceErrors from './jwtToken.service.errors';
import { Injectable } from '@nestjs/common';

@Injectable()
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
