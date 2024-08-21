import { Either, left, right } from '@common/core/either';
import ValueObject from '@common/core/valueObject';
import PasswordErrors from './password.errors';
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

export default class Password extends ValueObject<PasswordProps> {
  private constructor(content: PasswordProps) {
    super(content);
  }

  get value() {
    return this.content.password;
  }

  static create(
    password: string,
    shouldVerify: boolean = true,
  ): Either<
    InstanceType<(typeof PasswordErrors)['InvalidPasswordError']>,
    Password
  > {
    const passwordFormated = Password.format(password);

    if (shouldVerify && !Password.isValid(passwordFormated)) {
      return left(new PasswordErrors.InvalidPasswordError());
    }

    return right(new Password({ password: passwordFormated }));
  }

  static isValid(password: string): boolean {
    return passwordRegex.test(password);
  }

  static format(password: string): string {
    return password?.trim();
  }
}

type PasswordProps = {
  password: string;
};
