import { InspetorError } from '@shared/core/inspetor';
import GetUserByIdUseCase from './getUserById.useCase';
import Email from '@modules/user/domain/valueObjects/email.valueObject';
import User from '@modules/user/domain/entities/user.entity';
import FakeUserRepository from '@modules/user/infra/repositories/fakeUser.repository';

describe('GetUserByIdUseCase', () => {
  const makeSut = () => {
    const emailMock = Email.create('teste@teste.com');

    const userMock = User.create({
      name: 'Ayrlon',
      email: emailMock.value as Email,
      password: '123',
      username: 'ayrlon',
      id: '3',
    });

    const userRepository = new FakeUserRepository([userMock.value as User]);
    const sut = new GetUserByIdUseCase(userRepository);
    return { sut, userMock };
  };

  test('Should get one user', async () => {
    const { sut } = makeSut();

    const result = await sut.perform({ id: '3' });
    expect(result.isRight()).toBe(true);
    expect(result.value).toBeInstanceOf(User);
    if (result.isRight()) {
      expect(result.value.props.id).toEqual('3');
    }
  });

  test('Should dont get error when not found user', async () => {
    const { sut } = makeSut();

    const result = await sut.perform({ id: '698' });
    expect(result.isRight()).toBe(true);
    expect(result.value).not.toBeInstanceOf(User);
    expect(result.value).toBe(null);
  });

  test('Should get error when id is empty', async () => {
    const { sut } = makeSut();

    const result = await sut.perform({ id: null });
    expect(result.isLeft()).toBe(true);
    expect(result.value).toBeInstanceOf(InspetorError);
  });
});
