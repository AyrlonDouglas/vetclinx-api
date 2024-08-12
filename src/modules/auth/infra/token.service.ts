import { Either, left, right } from '@shared/core/either';
import TokenPort from '../domain/services/token.port';
import Token from '../domain/valueObjects/token/token.objectValue';
import jwt from 'jsonwebtoken';
import { InspetorError } from '@shared/core/inspetor';

export default class TokenService implements TokenPort {
  create(
    payload: any,
    secretKey: string,
    config?: { expiresIn: string; algorithm: string },
  ): Either<InspetorError, Token> {
    const tokenData = jwt.sign(payload, secretKey, {
      expiresIn: config.expiresIn,
    });

    const token = Token.create({
      token: tokenData,
      expiresIn: config.expiresIn,
    });

    if (token.isLeft()) {
      return left(token.value);
    }

    return right(token.value);
  }
}
