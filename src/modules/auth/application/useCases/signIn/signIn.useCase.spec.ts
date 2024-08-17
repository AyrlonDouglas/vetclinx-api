import SignInUseCase from './signIn.useCase';
import AuthTestSetup from '@modules/auth/test/AuthTest.setup';
import Token from '@modules/auth/domain/valueObjects/token/token.valueObject';
import SignInError from './signIn.errors';
import Credential from '@modules/auth/domain/valueObjects/credential/credential.valueObject';
import { left, right } from '@common/core/either';

describe('SignInUseCase', () => {
  const makeSut = async () => {
    const {
      authenticationService,
      validCredential,
      validEmail,
      validPassword,
    } = await new AuthTestSetup().prepare();

    const sut = new SignInUseCase(authenticationService);
    return {
      sut,
      authenticationService,
      validCredential,
      validEmail,
      validPassword,
    };
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

  test('Should return left containing UnauthorizedError when credential.create fail', async () => {
    jest
      .spyOn(Credential, 'create')
      .mockReturnValueOnce(right())
      .mockReturnValueOnce(left(new SignInError.UnauthorizedError()));

    const { sut, validEmail, validPassword } = await makeSut();

    const result = await sut.perform({
      email: validEmail.value,
      password: validPassword.value,
    });

    expect(result.isLeft()).toBe(true);
    expect(result.value).toBeInstanceOf(SignInError.UnauthorizedError);
  });

  test('Should return left containing UnauthorizedError when singIn fail', async () => {
    const { sut, validEmail, validPassword, authenticationService } =
      await makeSut();

    jest
      .spyOn(authenticationService, 'signIn')
      .mockResolvedValueOnce(left(new SignInError.UnauthorizedError()));

    const result = await sut.perform({
      email: validEmail.value,
      password: validPassword.value,
    });

    expect(result.isLeft()).toBe(true);
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
