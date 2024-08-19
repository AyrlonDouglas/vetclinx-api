import { InspetorError } from '@common/core/inspetor';
import User from '@modules/user/domain/entities/user.entity';
import FakeUserRepository from '@modules/user/infra/repositories/fakeUser.repository';
import Email from '@modules/user/domain/valueObjects/email/email.valueObject';
import Password from '@modules/user/domain/valueObjects/password/password.valueObject';
import GetUserByUsernameUseCase from '@modules/user/application/useCases/getUserByUsername/getUserByUsername.useCase';

describe('GetUserByUsernameUseCase', () => {
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
    const sut = new GetUserByUsernameUseCase(userRepository);
    return { sut, userMock };
  };

  test('Should get one user', async () => {
    const { sut } = makeSut();

    const result = await sut.perform({ username: 'ayrlon' });
    expect(result.isRight()).toBe(true);
    expect(result.value).toBeInstanceOf(User);
    if (result.isRight()) {
      expect(result.value.props.username).toEqual('ayrlon');
    }
  });

  test('Should dont get error when not found user', async () => {
    const { sut } = makeSut();

    const result = await sut.perform({ username: 'ayrlon123' });
    expect(result.isRight()).toBe(true);
    expect(result.value).not.toBeInstanceOf(User);
    expect(result.value).toBe(null);
  });

  test('Should get error when username is empty', async () => {
    const { sut } = makeSut();

    const result = await sut.perform({ username: '' });
    expect(result.isLeft()).toBe(true);
    expect(result.value).toBeInstanceOf(InspetorError);
  });
});
