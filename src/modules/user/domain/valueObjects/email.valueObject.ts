import { Either, left, right } from '@shared/core/either';

export class EmailError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'EmailError';
  }
}

const emailRegex =
  /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

export default class Email {
  private constructor(private readonly email: string) {}

  get value() {
    return this.email;
  }

  public static create(email: string): Either<EmailError, Email> {
    const emailFormated = Email.format(email);
    if (!Email.isValid(emailFormated)) {
      return left(new EmailError(`Email ${email} not is valid!`));
    }

    const newEmail = new Email(emailFormated);
    return right(newEmail);
  }

  private static isValid(email: string) {
    return emailRegex.test(email);
  }

  private static format(email: string): string {
    return email?.trim().toLowerCase();
  }
}
