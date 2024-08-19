import CreateUserUseCase from '@modules/user/application/useCases/createUser/createUser.useCase';
import GetUserByIdUseCase from '@modules/user/application/useCases/getUserById/getUserById.useCase';
import GetUserByUsernameUseCase from '@modules/user/application/useCases/getUserByUsername/getUserByUsername.useCase';
import RemoveUserByIdUseCase from '@modules/user/application/useCases/removeUserById/removeUserById.useCase';
import { UserTestSetup } from '@modulesTest/user/test/userTest.setup';

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
