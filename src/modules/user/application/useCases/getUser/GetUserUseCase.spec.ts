import { InspetorError } from '@shared/core/Inspetor';
import GetUserUseCase from './GetUserUseCase';
import Email from '../../../domain/valueObjects/Email';
import User from '../../../domain/entities/User';
import FakeUserRepository from '../../../infra/repositories/FakeUserRepository';

describe('GetUserUseCase', () => {
  const makeSut = () => {
    const emailMock = Email.create('teste@teste.com');

    const userMock = User.create({
      name: 'Ayrlon',
      email: emailMock.value as Email,
      password: '123',
      username: 'ayrlon',
    });

    const userRepository = new FakeUserRepository([userMock.value as User]);
    const sut = new GetUserUseCase(userRepository);
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

  test('Should get error when not found user', async () => {
    const { sut } = makeSut();

    const result = await sut.perform({ username: 'ayrlon123' });
    expect(result.isLeft()).toBe(true);
    expect(result.value).not.toBeInstanceOf(User);
  });

  test('Should get error when username is empty', async () => {
    const { sut } = makeSut();

    const result = await sut.perform({ username: '' });
    expect(result.isLeft()).toBe(true);
    expect(result.value).toBeInstanceOf(InspetorError);
  });
});
