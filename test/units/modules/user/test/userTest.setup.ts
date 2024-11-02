import HashService from '@modules/shared/domain/hash.service';
import BcryptHashService from '@modules/shared/infra/hash/bcrytHash.service';
import { UserRepository } from '@modules/user/application/repositories/user.repository';
import CreateUserUseCase from '@modules/user/application/useCases/createUser/createUser.useCase';
import GetUserByIdUseCase from '@modules/user/application/useCases/getUserById/getUserById.useCase';
import GetUserByUsernameUseCase from '@modules/user/application/useCases/getUserByUsername/getUserByUsername.useCase';
import RemoveUserByIdUseCase from '@modules/user/application/useCases/removeUserById/removeUserById.useCase';
import UserUseCases from '@modules/user/application/useCases/user.useCases';
import User, {
  UserStatus,
  UserType,
} from '@modules/user/domain/entities/user.entity';
import Email from '@modules/user/domain/valueObjects/email/email.valueObject';
import PasswordFactory from '@modules/user/domain/valueObjects/password/password.factory';
import Password from '@modules/user/domain/valueObjects/password/password.valueObject';
import { UserMapper } from '@modules/user/infra/mapper/user.mapper';
import FakeUserRepository from '@modules/user/infra/repositories/fakeUser.repository';

export class UserTestSetup {
  userMock: User;
  userMock2: User;
  userRepository: UserRepository;
  userMapper: UserMapper;
  getUserByIdUseCase: GetUserByIdUseCase;
  getUserByUsernameUseCase: GetUserByUsernameUseCase;
  createUserUseCase: CreateUserUseCase;
  removeUserByIdUserCase: RemoveUserByIdUseCase;
  passwordFactory: PasswordFactory;
  hashService: HashService;
  userUseCases: UserUseCases;

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
      brithDate: new Date('1996-04-16'),
      country: 'bra',
      graduationDate: new Date(),
      institution: 'UFRPE',
      status: UserStatus.active,
      userType: UserType.student,
    });

    if (userMock.isLeft()) throw new Error('userMock fail');
    if (userMock.isLeft()) throw new Error('userMock fail');

    this.userMock = userMock.value;

    const emailMock2 = Email.create('teste2@teste.com');
    if (emailMock2.isLeft()) throw new Error('email fail');

    const passwordMock2 = Password.create('SenhaForte54!2');
    if (passwordMock2.isLeft()) throw new Error('password fail');

    const userMock2 = User.create({
      name: 'Ayrlon2',
      email: emailMock2.value,
      password: passwordMock2.value,
      username: 'ayrlon2',
      id: '32',
      brithDate: new Date('1996-04-16'),
      country: 'bra',
      graduationDate: new Date(),
      institution: 'UFRPE',
      status: UserStatus.active,
      userType: UserType.student,
    });

    if (userMock2.isLeft()) throw new Error('userMock2 fail');

    this.userMock2 = userMock2.value;

    this.userRepository = new FakeUserRepository([this.userMock]);

    this.hashService = new BcryptHashService();
    this.passwordFactory = new PasswordFactory(this.hashService);

    this.getUserByIdUseCase = new GetUserByIdUseCase(this.userRepository);
    this.getUserByUsernameUseCase = new GetUserByUsernameUseCase(
      this.userRepository,
    );
    this.removeUserByIdUserCase = new RemoveUserByIdUseCase(
      this.userRepository,
    );
    this.createUserUseCase = new CreateUserUseCase(
      this.userRepository,
      this.passwordFactory,
    );
    this.userUseCases = new UserUseCases(
      this.getUserByUsernameUseCase,
      this.createUserUseCase,
      this.getUserByIdUseCase,
      this.removeUserByIdUserCase,
    );
    return this;
  }
}
