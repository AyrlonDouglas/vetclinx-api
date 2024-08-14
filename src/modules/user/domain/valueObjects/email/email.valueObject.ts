import { Either, left, right } from '@shared/core/either';
import ValueObject from '@shared/core/valueObject';

export class EmailError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'EmailError';
  }
}

const emailRegex =
  /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

export default class Email extends ValueObject<EmailProps> {
  private constructor(content: EmailProps) {
    super(content);
  }

  get value() {
    return this.content.email;
  }

  public static create(email: string): Either<EmailError, Email> {
    const emailFormated = Email.format(email);
    if (!Email.isValid(emailFormated)) {
      return left(new EmailError(`Email ${email} not is valid!`));
    }

    const newEmail = new Email({ email: emailFormated });
    return right(newEmail);
  }

  private static isValid(email: string) {
    return emailRegex.test(email);
  }

  private static format(email: string): string {
    return email?.trim().toLowerCase();
  }
}

interface EmailProps {
  email: string;
}
