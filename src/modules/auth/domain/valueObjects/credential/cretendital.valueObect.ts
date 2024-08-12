import Email from '@modules/user/domain/valueObjects/email/email.valueObject';
import Password from '@modules/user/domain/valueObjects/password/password.valueObject';
import { Either, left, right } from '@shared/core/either';
import Inspetor from '@shared/core/inspetor';

export class CredentialError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'CredentialError';
  }
}

export default class Credential {
  private constructor(
    private readonly email: Email,
    private readonly password: Password,
  ) {}

  get props(): CredentialProps {
    return {
      email: this.email,
      password: this.password,
    };
  }

  static create(
    input: CredentialCreateInput,
  ): Either<CredentialError, Credential> {
    const inputOrFail = Inspetor.againstFalsyBulk([
      { argument: input.email.value, argumentName: 'email' },
      { argument: input.password.value, argumentName: 'password' },
    ]);

    if (inputOrFail.isLeft()) {
      return left(new CredentialError(inputOrFail.value.message));
    }

    const credential = new Credential(input.email, input.password);

    return right(credential);
  }
}

interface CredentialProps {
  email: Email;
  password: Password;
}

export interface CredentialCreateInput extends CredentialProps {}
