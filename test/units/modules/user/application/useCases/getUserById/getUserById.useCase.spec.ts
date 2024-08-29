import { InspetorError } from '@common/core/inspetor';
import User from '@modules/user/domain/entities/user.entity';
import { UserTestSetup } from '@modulesTest/user/test/userTest.setup';

describe('GetUserByIdUseCase', () => {
  const makeSut = () => {
    const { getUserByIdUseCase, userMock } = new UserTestSetup().prepare();
    const sut = getUserByIdUseCase;
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

  test('Should return null when not found user', async () => {
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
