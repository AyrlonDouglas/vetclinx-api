import { Either, left, right } from '@shared/core/either';
import Inspetor, { InspetorError } from '@shared/core/inspetor';

// TODO: criar testes
// TODO: criar error

export default class Token {
  private constructor(
    private readonly token: string,
    private readonly expiresIn: string,
  ) {}

  static create(input: TokenCreateInput): Either<InspetorError, Token> {
    const inputOrFail = Inspetor.againstFalsyBulk([
      { argument: input.token, argumentName: 'token' },
      { argument: input.expiresIn, argumentName: 'expiresIn' },
    ]);

    if (inputOrFail.isLeft()) {
      return left(inputOrFail.value);
    }
    const token = new Token(input.token, input.expiresIn);
    return right(token);
  }
}

interface TokenProps {
  token: string;
  expiresIn: string;
}

export interface TokenCreateInput extends TokenProps {}
