import { Either, left, right } from '@common/core/either';
import BaseError from '@common/errors/baseError.error';
import { HttpStatusCode } from '@common/http/httpStatusCode';
import { User as UserPostgre } from '@modules/database/infra/posgreSQL/entities/user.db.entity';
import { UserRepository } from '@modules/user/application/repositories/user.repository';
import User from '@modules/user/domain/entities/user.entity';
import Email from '@modules/user/domain/valueObjects/email/email.valueObject';
import Password from '@modules/user/domain/valueObjects/password/password.valueObject';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

export class UserPostgreRepository implements UserRepository {
  constructor(
    @InjectRepository(UserPostgre)
    private userRepository: Repository<UserPostgre>,
  ) {}

  findById(id: string): Promise<User | null> {
    id;
    throw new Error('Method not implemented.');
  }
  async findByUsername(username: string): Promise<User | null> {
    const user = await this.userRepository.findOneBy({ username });

    if (!user) return null;

    const userDomainOrFail = this.toDomain(user);
    if (userDomainOrFail.isLeft()) {
      throw userDomainOrFail.value;
    }

    return userDomainOrFail.value;
  }

  async findByEmail(email: string): Promise<User | null> {
    const user = await this.userRepository.findOneBy({ email });

    if (!user) return null;

    const userDomainOrFail = this.toDomain(user);
    if (userDomainOrFail.isLeft()) {
      throw userDomainOrFail.value;
    }

    return userDomainOrFail.value;
  }

  async save(user: User): Promise<string> {
    const userToSave = this.toEntity(user);

    await userToSave.save();

    return userToSave.id.toString();
  }
  removeById(id: string): Promise<string | null> {
    id;
    throw new Error('Method not implemented.');
  }
  findAll(): Promise<User[]> {
    throw new Error('Method not implemented.');
  }

  toDomain(userPostgre: UserPostgre): Either<BaseError, User> {
    const emailOrFail = Email.create(userPostgre.email);
    if (emailOrFail.isLeft()) {
      return left(
        new BaseError(['Some Error in email'], HttpStatusCode.CONFLICT),
      );
    }

    const passwordOrFail = Password.create(userPostgre.password, false);
    if (passwordOrFail.isLeft()) {
      return left(
        new BaseError(['Some error in password'], HttpStatusCode.CONFLICT),
      );
    }

    const user = User.create({
      birthDate: userPostgre.birthDate,
      country: userPostgre.country,
      email: emailOrFail.value,
      graduationDate: userPostgre.graduationDate,
      institution: userPostgre.institution,
      name: userPostgre.name,
      password: passwordOrFail.value,
      status: userPostgre.status,
      username: userPostgre.username,
      userType: userPostgre.userType,
      id: userPostgre.id.toString(),
      phoneNumber: userPostgre.phoneNumber,
      professionalRegistration: userPostgre.professionalRegistration,
      specialization: [],
    });

    if (user.isLeft()) {
      return left(
        new BaseError(['Some error in user'], HttpStatusCode.CONFLICT),
      );
    }

    return right(user.value);
  }

  toEntity(user: User): UserPostgre {
    const userPlain = user.toPlain();

    const userToSave = new UserPostgre();
    userToSave.birthDate = userPlain.birthDate;
    userToSave.country = userPlain.country;
    userToSave.email = userPlain.email;
    userToSave.graduationDate = userPlain.graduationDate;
    userToSave.id = userPlain.id ? +userPlain.id : undefined;
    userToSave.institution = userPlain.institution;
    userToSave.name = userPlain.name;
    userToSave.password = userPlain.password;
    userToSave.phoneNumber = userPlain.phoneNumber;
    userToSave.professionalRegistration = userPlain.professionalRegistration;
    userToSave.status = userPlain.status;
    userToSave.userType = userPlain.userType;
    userToSave.username = userPlain.username;

    return userToSave;
  }
}
