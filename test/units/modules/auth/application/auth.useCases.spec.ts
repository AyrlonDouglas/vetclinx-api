import SignInUseCase from '@modules/auth/application/useCases/signIn/signIn.useCase';
import AuthTestSetup from '../test/AuthTest.setup';
import AuthUseCases from '@modules/auth/application/useCases/auth.useCases';

describe('AuthUserCases', () => {
  const makeSut = async () => {
    const { authenticationService } = await new AuthTestSetup().prepare();

    const signInUserCase = new SignInUseCase(authenticationService);
    const sut = new AuthUseCases(signInUserCase);

    return { sut };
  };

  test('Should return SignInUseCase instance', async () => {
    const { sut } = await makeSut();

    const result = sut.signIn;

    expect(result).toBeInstanceOf(SignInUseCase);
    expect(result.perform).toBeDefined();
  });
});
