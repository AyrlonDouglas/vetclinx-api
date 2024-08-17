import AuthTestSetup from '@modules/auth/test/AuthTest.setup';
import AuthUseCases from './auth.useCases';
import SignInUseCase from './signIn/signIn.useCase';

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
