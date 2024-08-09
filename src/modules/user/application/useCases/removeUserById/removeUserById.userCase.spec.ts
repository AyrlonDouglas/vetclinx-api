import User from '@modules/user/domain/entities/user.entity';
import Email from '@modules/user/domain/valueObjects/email.valueObject';
import FakeUserRepository from '@modules/user/infra/repositories/fakeUser.repository';
import RemoveUserByIdUseCase from './removeUserById.userCase';
import { InspetorError } from '@shared/core/inspetor';

describe('RemoveUserByUsernameUseCase', () => {
  const makeSut = () => {
    const emailMock = Email.create('teste@teste.com');

    const userMock = User.create({
      name: 'Ayrlon',
      email: emailMock.value as Email,
      password: '123',
      username: 'ayrlon',
      id: '156',
    }).value as User;

    const userRepository = new FakeUserRepository([userMock]);
    const sut = new RemoveUserByIdUseCase(userRepository);
    return { sut, userMock, userRepository };
  };

  test('Should remove one user', async () => {
    const { sut, userMock, userRepository } = makeSut();

    const result = await sut.perform({ id: userMock.props.id });
    expect(result.isRight()).toBe(true);
    expect(result.value).toBe(userMock.props.id);
    if (result.isRight()) {
      const user = await userRepository.findById(userMock.props.id);
      expect(user).toEqual(null);
    }
  });

  test('Should return null when dont found user', async () => {
    const { sut } = makeSut();

    const result = await sut.perform({ id: 'iderrado' });
    expect(result.isRight()).toBe(true);
    expect(result.value).not.toBeInstanceOf(User);
    expect(result.value).toBe(null);
  });

  test('Should get error when id is empty', async () => {
    const { sut } = makeSut();

    const result = await sut.perform({ id: '' });
    expect(result.isLeft()).toBe(true);
    expect(result.value).toBeInstanceOf(InspetorError);
  });
});
