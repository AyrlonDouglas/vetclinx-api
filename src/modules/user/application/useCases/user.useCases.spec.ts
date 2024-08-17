import { UserTestSetup } from '@modules/user/test/userTest.setup';
import CreateUserUseCase from './createUser/createUser.useCase';
import GetUserByIdUseCase from './getUserById/getUserById.useCase';
import GetUserByUsernameUseCase from './getUserByUsername/getUserByUsername.useCase';
import RemoveUserByIdUseCase from './removeUserById/removeUserById.useCase';

describe('UserUseCases', () => {
  const makeSut = () => {
    const { userUseCases } = new UserTestSetup().prepare();

    const sut = userUseCases;

    return { sut };
  };

  test('Should return CreateUseUseCase instance', () => {
    const { sut } = makeSut();

    const result = sut.createUser;

    expect(result).toBeInstanceOf(CreateUserUseCase);
    expect(result.perform).toBeDefined();
  });

  test('Should return GetUserByIdUseCase instance', () => {
    const { sut } = makeSut();

    const result = sut.getUserById;

    expect(result).toBeInstanceOf(GetUserByIdUseCase);
    expect(result.perform).toBeDefined();
  });

  test('Should return GetUserByUsenameUseCase instance', () => {
    const { sut } = makeSut();

    const result = sut.getUserByUsername;

    expect(result).toBeInstanceOf(GetUserByUsernameUseCase);
    expect(result.perform).toBeDefined();
  });

  test('Should return RemoveUserByIdUseCase instance', () => {
    const { sut } = makeSut();

    const result = sut.removeUserById;

    expect(result).toBeInstanceOf(RemoveUserByIdUseCase);
    expect(result.perform).toBeDefined();
  });
});
