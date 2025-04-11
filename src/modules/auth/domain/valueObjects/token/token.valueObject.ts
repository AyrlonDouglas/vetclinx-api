import { Either, left, right } from '@common/core/either';
import Inspector from '@common/core/inspector';

// TODO: criar testes
// TODO: criar error

export class TokenError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'TokenError';
  }
}

export default class Token {
  private constructor(
    private readonly token: string,
    private readonly expiresIn: string,
  ) {}

  get props() {
    return { token: this.token, expiresIn: this.expiresIn };
  }

  static create(input: TokenCreateInput): Either<TokenError, Token> {
    const inputOrFail = Inspector.againstFalsyBulk([
      { argument: input.token, argumentName: 'token' },
      { argument: input.expiresIn, argumentName: 'expiresIn' },
    ]);

    if (inputOrFail.isLeft()) {
      return left(new TokenError(inputOrFail.value.message));
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
