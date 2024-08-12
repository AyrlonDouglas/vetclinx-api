import { Either, left, right } from '@shared/core/either';
import Inspetor, { InspetorError } from '@shared/core/inspetor';
import Email from '../valueObjects/email/email.valueObject';
import Password from '../valueObjects/password/password.valueObject';

export default class User {
  private constructor(
    private name: string,
    private username: string,
    private email: Email,
    private password: Password,
    private id?: string,
  ) {}

  get props(): UserProps {
    return {
      name: this.name,
      username: this.username,
      email: this.email,
      password: this.password,
      id: this.id,
    };
  }

  static create(input: UserCreateInput): Either<InspetorError, User> {
    const inputOrFail = Inspetor.againstFalsyBulk([
      { argument: input.email, argumentName: 'email' },
      { argument: input.name, argumentName: 'name' },
      { argument: input.username, argumentName: 'username' },
      { argument: input.password, argumentName: 'password' },
    ]);

    if (inputOrFail.isLeft()) {
      return left(inputOrFail.value);
    }

    const user = new User(
      input.name,
      input.username,
      input.email,
      input.password,
      input.id,
    );

    return right(user);
  }
}

interface UserProps {
  name: string;
  username: string;
  email: Email;
  password: Password;
  id?: string;
}

interface UserCreateInput extends UserProps {}
