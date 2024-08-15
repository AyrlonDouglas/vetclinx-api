import { UserMapper } from '../application/mappers/user.mapper';
import { UserRepository } from '../application/repositories/user.repository';
import GetUserByIdUseCase from '../application/useCases/getUserById/getUserById.useCase';
import User from '../domain/entities/user.entity';
import Email from '../domain/valueObjects/email/email.valueObject';
import Password from '../domain/valueObjects/password/password.valueObject';
import FakeUserRepository from '../infra/repositories/fakeUser.repository';

export class UserTestSetup {
  userMock: User;
  userRepository: UserRepository;
  userMapper: UserMapper;
  getUserByIdUseCase: GetUserByIdUseCase;

  constructor() {}

  prepare() {
    const emailMock = Email.create('teste@teste.com');
    if (emailMock.isLeft()) throw new Error('email fail');

    const passwordMock = Password.create('SenhaForte54!');
    if (passwordMock.isLeft()) throw new Error('password fail');

    const userMock = User.create({
      name: 'Ayrlon',
      email: emailMock.value,
      password: passwordMock.value,
      username: 'ayrlon',
      id: '3',
    });

    if (userMock.isLeft()) throw new Error('userMock fail');

    this.userMock = userMock.value;

    this.userRepository = new FakeUserRepository([this.userMock]);

    this.getUserByIdUseCase = new GetUserByIdUseCase(this.userRepository);
    return this;
  }
}
