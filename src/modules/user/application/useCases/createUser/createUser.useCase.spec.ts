import User from '../../../domain/entities/user.entity';
import FakeUserRepository from '../../../infra/repositories/fakeUser.repository';
import Email, {
  EmailError,
} from '../../../domain/valueObjects/email.valueObject';
import CreateUserErrors from './createUser.errors';

import CreateUserUseCase from './createUser.useCase';

describe('CreateUserUseCase', () => {
  const makeSut = () => {
    const emailMock = Email.create('teste@teste.com');

    const userMock = User.create({
      name: 'Ayrlon',
      email: emailMock.value as Email,
      password: '123',
      username: 'ayrlon',
    });

    const userRepository = new FakeUserRepository([userMock.value as User]);

    const sut = new CreateUserUseCase(userRepository);
    const input = {
      name: 'Ayrlon',
      username: 'ayrlon.vilarim',
      email: 'ayrlon.teste@test.com',
      password: '123123',
    };
    return {
      sut,
      userRepository,
      input,
    };
  };

  test('Should create a user', async () => {
    const { sut, userRepository, input } = makeSut();

    const result = await sut.perform(input);

    expect(result).toBeTruthy();
    expect(result.isRight()).toBe(true);
    if (result.isRight()) {
      expect(result.value).toBe(undefined);

      const userCreated = await userRepository.findByUsername(input.username);
      expect(userCreated.props.username).toEqual(input.username);
      expect(userCreated.props.email).toEqual(input.email);
      expect(userCreated.props.name).toEqual(input.name);
      expect(userCreated.props.password).toEqual(input.password);
    }
  });

  test('Should return left when input is invalid', async () => {
    const { sut, input } = makeSut();

    const result = await sut.perform({
      ...input,
      email: 'ayrlon.testetest.com',
    });

    expect(result).toBeTruthy();
    expect(result.isLeft()).toBe(true);
    expect(result.value).toBeInstanceOf(EmailError);
  });

  test('Should return left when input is alread exist account with same username', async () => {
    const { sut, input } = makeSut();
    const username = 'ayrlon';

    const result = await sut.perform({ ...input, username: username });

    expect(result.isLeft()).toBe(true);
    expect(result.value).toBeInstanceOf(CreateUserErrors.usernameTakenError);
  });

  test('Should return left when input is alread exist account with same email', async () => {
    const { sut, input } = makeSut();
    const email = 'teste@teste.com';

    const result = await sut.perform({ ...input, email });

    expect(result.isLeft()).toBe(true);
    expect(result.value).toBeInstanceOf(
      CreateUserErrors.emailAlreadyExistsError,
    );
  });
});
