import User from '@modules/user/domain/entities/user.entity';
import FakeUserRepository from '@modules/user/infra/repositories/fakeUser.repository';
import Email, {
  EmailError,
} from '@modules/user/domain/valueObjects/email/email.valueObject';
import CreateUserErrors from './createUser.errors';

import CreateUserUseCase from './createUser.useCase';
import Password from '@modules/user/domain/valueObjects/password/password.valueObject';

describe('CreateUserUseCase', () => {
  const makeSut = () => {
    const emailMock = Email.create('teste@teste.com');
    const passwordMock = Password.create('SenhaForte54!');

    const userMock = User.create({
      name: 'Ayrlon',
      email: emailMock.value as Email,
      password: passwordMock.value as Password,
      username: 'ayrlon',
    });

    const userRepository = new FakeUserRepository([userMock.value as User]);

    const sut = new CreateUserUseCase(userRepository);
    const input = {
      name: 'Ayrlon',
      username: 'ayrlon.vilarim',
      email: 'ayrlon.teste@test.com',
      password: 'SenhaForte12@',
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
      expect(result.value).toBeDefined();
      expect(result.value).toHaveProperty('id', expect.any(String));

      const userCreated = await userRepository.findById(result.value.id);
      expect(userCreated.props.username).toEqual(input.username);
      expect(userCreated.props.email.value).toEqual(input.email);
      expect(userCreated.props.name).toEqual(input.name);
      expect(userCreated.props.password.value).toEqual(input.password);
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
