import BaseError from '@common/errors/baseError.error';
import { HttpStatusCode } from '@common/http/httpStatusCode';
import { User as UserPostgre } from '@modules/database/infra/postgreSQL/entities/user.db.entity';
import { TransactionService } from '@modules/shared/domain/transaction.service';
import { UserRepository } from '@modules/user/application/repositories/user.repository';
import User from '@modules/user/domain/entities/user.entity';
import Email from '@modules/user/domain/valueObjects/email/email.valueObject';
import Password from '@modules/user/domain/valueObjects/password/password.valueObject';
import { Injectable } from '@nestjs/common';
import { EntityManager } from 'typeorm';

@Injectable()
export class UserPostgreRepository implements UserRepository {
  constructor(private readonly transactionService: TransactionService) {}

  async findById(id: string): Promise<User | null> {
    const user = await this.getRepository().findOneBy({ id: +id });

    if (!user) return null;

    return this.toDomain(user);
  }

  async findByUsername(username: string): Promise<User | null> {
    const user = await this.getRepository().findOneBy({ username });

    if (!user) return null;

    return this.toDomain(user);
  }

  async findByEmail(email: string): Promise<User | null> {
    const user = await this.getRepository().findOneBy({ email });

    if (!user) return null;

    return this.toDomain(user);
  }

  async save(user: User): Promise<string> {
    const userToSave = this.toEntityPostgre(user);
    const repository = this.getRepository();
    await repository.save(userToSave);

    return userToSave.id.toString();
  }

  async removeById(id: string): Promise<string | null> {
    const deleteResult = await this.getRepository().delete({ id: +id });

    if (!deleteResult.affected) return null;

    return id;
  }

  async findAll(): Promise<User[]> {
    throw new Error('Method not implemented.');
  }

  private toDomain(userPostgre: UserPostgre): User {
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

  private toEntityPostgre(user: User): UserPostgre {
    const userPlained = user.toPlain({ showPassword: true });

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

  getRepository() {
    const entityManager =
      this.transactionService.getEntityManager() as EntityManager;

    return entityManager.withRepository(
      entityManager.getRepository(UserPostgre),
    );
  }
}
