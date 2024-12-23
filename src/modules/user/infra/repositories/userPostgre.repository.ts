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

  async findById(id: string): Promise<User | null> {
    const user = await this.userRepository.findOneBy({ id: +id });

    if (!user) return null;

    return this.toDomain(user);
  }

  async findByUsername(username: string): Promise<User | null> {
    const user = await this.userRepository.findOneBy({ username });

    if (!user) return null;

    return this.toDomain(user);
  }

  async findByEmail(email: string): Promise<User | null> {
    const user = await this.userRepository.findOneBy({ email });

    if (!user) return null;

    return this.toDomain(user);
  }

  async save(user: User): Promise<string> {
    const userToSave = this.toEntityPostgre(user);

    await userToSave.save();

    return userToSave.id.toString();
  }

  async removeById(id: string): Promise<string | null> {
    const userDeleted = await this.userRepository.delete({ id: +id });

    if (!userDeleted.affected) return null;

    return id;
  }

  async findAll(): Promise<User[]> {
    throw new Error('Method not implemented.');
  }

  toDomain(userPostgre: UserPostgre): User {
    const emailOrFail = Email.create(userPostgre.email);
    if (emailOrFail.isLeft()) {
      throw new BaseError(['Some Error to map email'], HttpStatusCode.CONFLICT);
    }

    const passwordOrFail = Password.create(userPostgre.password, false);
    if (passwordOrFail.isLeft()) {
      throw new BaseError(
        ['Some error to map password'],
        HttpStatusCode.CONFLICT,
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
      throw new BaseError(['Some error to map user'], HttpStatusCode.CONFLICT);
    }

    return user.value;
  }

  toEntityPostgre(user: User): UserPostgre {
    const userPlained = user.toPlain();

    const userToSave = new UserPostgre();
    userToSave.birthDate = userPlained.birthDate;
    userToSave.country = userPlained.country;
    userToSave.email = userPlained.email;
    userToSave.graduationDate = userPlained.graduationDate;
    userToSave.id = userPlained.id ? +userPlained.id : undefined;
    userToSave.institution = userPlained.institution;
    userToSave.name = userPlained.name;
    userToSave.password = userPlained.password;
    userToSave.phoneNumber = userPlained.phoneNumber;
    userToSave.professionalRegistration = userPlained.professionalRegistration;
    userToSave.status = userPlained.status;
    userToSave.userType = userPlained.userType;
    userToSave.username = userPlained.username;

    return userToSave;
  }
}
