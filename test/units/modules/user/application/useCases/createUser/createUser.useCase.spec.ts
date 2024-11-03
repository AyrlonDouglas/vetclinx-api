import { EmailError } from '@modules/user/domain/valueObjects/email/email.valueObject';

import { left } from '@common/core/either';
import PasswordErrors from '@modules/user/domain/valueObjects/password/password.errors';
import User, {
  UserStatus,
  UserType,
} from '@modules/user/domain/entities/user.entity';
import { InspetorError } from '@common/core/inspetor';
import CreateUserErrors from '@modules/user/application/useCases/createUser/createUser.errors';
import { UserTestSetup } from '@modulesTest/user/test/userTest.setup';
import { CreateUserDTO } from '@modules/user/application/useCases/createUser/createUser.dto';

describe('CreateUserUseCase', () => {
  const makeSut = () => {
    const { createUserUseCase, userRepository, passwordFactory } =
      new UserTestSetup().prepare();

    const input: CreateUserDTO = {
      name: 'Ayrlon',
      username: 'ayrlon.vilarim',
      email: 'ayrlon.teste@test.com',
      password: 'SenhaForte12@',
      birthDate: new Date('1996-04-16'),
      country: 'bra',
      graduationDate: new Date(),
      institution: 'UFRPE',
      status: UserStatus.active,
      userType: UserType.student,
    };

    return {
      sut: createUserUseCase,
      userRepository,
      input,
      passwordFactory,
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
      expect(userCreated.props.password.value).toBeTruthy();
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
    expect(result.value).toBeInstanceOf(CreateUserErrors.UsernameTakenError);
  });

  test('Should return left when input is alread exist account with same email', async () => {
    const { sut, input } = makeSut();
    const email = 'teste@teste.com';

    const result = await sut.perform({ ...input, email });

    expect(result.isLeft()).toBe(true);
    expect(result.value).toBeInstanceOf(
      CreateUserErrors.EmailAlreadyExistsError,
    );
  });

  test('Should reuturn left when passwordFactory.create fail', async () => {
    const { sut, input, passwordFactory } = makeSut();

    jest
      .spyOn(passwordFactory, 'create')
      .mockResolvedValueOnce(left(new PasswordErrors.InvalidPasswordError()));

    const result = await sut.perform(input);

    expect(result.isLeft()).toBe(true);
    expect(result.value).toBeInstanceOf(PasswordErrors.InvalidPasswordError);
  });

  test('Should reuturn left when passwordFactory.create fail', async () => {
    const { sut, input } = makeSut();

    jest.spyOn(User, 'create').mockReturnValueOnce(left(new InspetorError('')));

    const result = await sut.perform(input);

    expect(result.isLeft()).toBe(true);
    expect(result.value).toBeInstanceOf(InspetorError);
  });
});
