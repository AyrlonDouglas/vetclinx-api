import { Either, left, right } from '@shared/core/either';

/**
 * Pelo menos 8 caracteres.
 * Não mais que 32 caracteres.
 * Pelo menos uma letra maiúscula e uma minúscula.
 * Somente caracteres do alfabeto latino ou cirílico.
 * Pelo menos um numeral (numerais arábicos).
 * Sem espaços.
 * Outros caracteres válidos: ~ ! ? @ # $ % ^ & * _ - + ( ) [ ] { } > < / \ | " ' . , : ;
 */

const passwordRegex =
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[~!?@#$%^&*_\-+\[\]\{\}<>/\\|"'.,:;])[A-Za-zА-Яа-яЁё\d~!?@#$%^&*_\-+\[\]\{\}<>/\\|"'.,:;]{8,32}$/;

export class PasswordError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'PasswordError';
  }
}

export default class Password {
  private constructor(private readonly password: string) {}

  get value() {
    return this.password;
  }

  static create(password: string): Either<PasswordError, Password> {
    const passwordFormated = Password.format(password);

    if (!Password.isValid(passwordFormated)) {
      return left(new PasswordError(`Password ${password} not is valid!`));
    }

    return right(new Password(passwordFormated));
  }

  static isValid(password: string): boolean {
    return passwordRegex.test(password);
  }

  private static format(password: string): string {
    return password?.trim();
  }
}
