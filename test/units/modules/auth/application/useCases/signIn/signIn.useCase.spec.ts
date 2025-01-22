import Token from '@modules/auth/domain/valueObjects/token/token.valueObject';
import Credential from '@modules/auth/domain/valueObjects/credential/credential.valueObject';
import { left, right } from '@common/core/either';
import SignInUseCase from '@modules/auth/application/useCases/signIn/signIn.useCase';
import SignInError from '@modules/auth/application/useCases/signIn/signIn.errors';
import AuthTestSetup from '@modulesTest/auth/test/AuthTest.setup';
import User from '@modules/user/domain/entities/user.entity';

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
    expect(result.isRight()).toBe(true);
    if (result.isRight()) {
      expect(result.value.token).toBeInstanceOf(Token);
      expect(result.value.user).toBeInstanceOf(User);
    }
  });
});
