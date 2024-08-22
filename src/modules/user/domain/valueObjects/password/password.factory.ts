import HashService from '@modules/shared/domain/hash.service';
import Password from './password.valueObject';
import { Either, left, right } from '@common/core/either';
import PasswordErrors from './password.errors';

export default class PasswordFactory {
  constructor(private readonly hashService: HashService) {}

  async create(
    password: string,
  ): Promise<
    Either<
      InstanceType<(typeof PasswordErrors)['InvalidPasswordError']>,
      Password
    >
  > {
    const isValid = Password.isValid(Password.format(password));

    if (!isValid) {
      return left(new PasswordErrors.InvalidPasswordError());
    }
    const salt = await this.hashService.genSalt(10);
    const hashedPass = await this.hashService.hash(password, salt);
    const pass = Password.create(hashedPass, false);

    if (pass.isLeft()) {
      return left(pass.value);
    }

    return right(pass.value);
  }
}
