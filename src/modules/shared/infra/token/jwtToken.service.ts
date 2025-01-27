import * as jwt from 'jsonwebtoken';
import { Either, left, right } from '@common/core/either';
import Inspetor from '@common/core/inspetor';
import TokenService, {
  PayloadToken,
  TokenServiceCreateInput,
  TokenServiceVerifyAsyncInput,
  VerifyAsyncResult,
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
      { argument: input.payload.userId, argumentName: 'payload-user' },
      { argument: input.secretKey, argumentName: 'secretKey' },
    ]);

    if (inputOrError.isLeft()) {
      return left(
        new TokenServiceErrors.InvalidInputError(inputOrError.value.message),
      );
    }

    const tokenData = jwt.sign(input.payload, input.secretKey, {
      expiresIn: input.config.expiresIn as any,
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

  async verifyAsync(
    input: TokenServiceVerifyAsyncInput,
  ): Promise<VerifyAsyncResult> {
    return new Promise((resolve) => {
      jwt.verify(input.token, input.secretKey, (err, decoded) => {
        if (err) {
          return resolve(left(err));
        }

        if (
          typeof decoded === 'object' &&
          decoded !== null &&
          'userId' in decoded
        ) {
          const payload = { userId: (decoded as any).userId } as PayloadToken;
          return resolve(right(payload));
        }

        return resolve(left(new TokenServiceErrors.InvalidTokenPayloadError()));
      });
    });
  }
}
