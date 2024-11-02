import User, {
  UserStatus,
  UserType,
} from '@modules/user/domain/entities/user.entity';
import Email from '@modules/user/domain/valueObjects/email/email.valueObject';
import FakeUserRepository from '@modules/user/infra/repositories/fakeUser.repository';
import { InspetorError } from '@common/core/inspetor';
import Password from '@modules/user/domain/valueObjects/password/password.valueObject';
import RemoveUserByIdUseCase from '@modules/user/application/useCases/removeUserById/removeUserById.useCase';

describe('RemoveUserByUsernameUseCase', () => {
  const makeSut = () => {
    const emailMock = Email.create('teste@teste.com');
    const passwordMock = Password.create('SenhaForte54!');

    const userMock = User.create({
      name: 'Ayrlon',
      email: emailMock.value as Email,
      password: passwordMock.value as Password,
      username: 'ayrlon',
      id: '156',
      brithDate: new Date('1996-04-16'),
      country: 'bra',
      graduationDate: new Date(),
      institution: 'UFRPE',
      status: UserStatus.active,
      userType: UserType.student,
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
