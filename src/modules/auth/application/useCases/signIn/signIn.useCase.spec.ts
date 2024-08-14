import SignInUseCase from './signIn.useCase';
import AuthTestFactory from '@modules/auth/test/AuthTestfactory';
import Token from '@modules/auth/domain/valueObjects/token/token.objectValue';
import SignInError from './signIn.errors';

describe('SignInUseCase', () => {
  const makeSut = async () => {
    const { authenticationService, validCredential } =
      await new AuthTestFactory().prepare();

    const sut = new SignInUseCase(authenticationService);
    return { sut, authenticationService, validCredential };
  };

  test('Should return left containing UnauthorizedError when email invalid', async () => {
    const { sut } = await makeSut();

    const result = await sut.perform({
      email: '124asd@com',
      password: 'Senha3@',
    });

    expect(result).toBeDefined();
    expect(result.isLeft()).toEqual(true);
    expect(result.value).toBeInstanceOf(SignInError.UnauthorizedError);
  });

  test('Should returnl left containing UnauthorizedError when password invalid', async () => {
    const { sut } = await makeSut();

    const result = await sut.perform({
      email: '124asd@com.com',
      password: 'Senha3@',
    });

    expect(result).toBeDefined();
    expect(result.isLeft()).toEqual(true);
    expect(result.value).toBeInstanceOf(SignInError.UnauthorizedError);
  });

  test('Should return rigth containing a Token', async () => {
    const { sut, validCredential } = await makeSut();
    const result = await sut.perform({
      email: validCredential.props.email.value,
      password: validCredential.props.password.value,
    });

    expect(result).toBeDefined();
    expect(result.isRight()).toEqual(true);
    expect(result.value).toBeInstanceOf(Token);
  });
});
