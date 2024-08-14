import Credential from '../../valueObjects/credential/credential.valueObject';
import Email from '@modules/user/domain/valueObjects/email/email.valueObject';
import Password from '@modules/user/domain/valueObjects/password/password.valueObject';
import AuthenticationErrors from './authentication.errors';
import TokenServiceErrors from '@modules/shared/infra/token/jwtToken.service.errors';
import Token from '../../valueObjects/token/token.objectValue';
import AuthTestFactory from '@modules/auth/test/AuthTestfactory';
import { left } from '@shared/core/either';

describe('AuthenticationService', () => {
  const makeSut = async () => {
    const invalidCredential = Credential.create({
      email: Email.create('teste@teste.com').value as Email,
      password: Password.create('SinvalidForte12@!').value as Password,
    }).value as Credential;

    const invalidCredential2 = Credential.create({
      email: Email.create('invalid@testeteste.com.br').value as Email,
      password: Password.create('SenhaForte54!').value as Password,
    }).value as Credential;

    const { tokenService, validCredential, authenticationService } =
      await new AuthTestFactory().prepare();

    const sut = authenticationService;

    return {
      sut,
      validCredential,
      invalidCredential,
      invalidCredential2,
      tokenService,
    };
  };

  describe(`signIn`, () => {
    test('Should return left containing InvalidCredentialError when invalid credentials', async () => {
      const { sut, invalidCredential, invalidCredential2 } = await makeSut();

      const result = await sut.signIn(invalidCredential);
      const result2 = await sut.signIn(invalidCredential2);

      expect(result).toBeDefined();
      expect(result.isLeft()).toBe(true);
      expect(result.value).toBeInstanceOf(
        AuthenticationErrors.InvalidCredentialError,
      );

      expect(result2).toBeDefined();
      expect(result2.isLeft()).toBe(true);
      expect(result2.value).toBeInstanceOf(
        AuthenticationErrors.InvalidCredentialError,
      );
    });

    test('Should return left containing TokenError when secret invalid', async () => {
      const { sut, validCredential, tokenService } = await makeSut();
      jest
        .spyOn(tokenService, 'create')
        .mockResolvedValue(
          left(new TokenServiceErrors.InvalidInputError('invalid')),
        );

      const result = await sut.signIn(validCredential);

      expect(result).toBeDefined();
      expect(result.isLeft()).toEqual(true);
      expect(result.value).toBeInstanceOf(TokenServiceErrors.InvalidInputError);
    });

    test('Should return rigth containing Token when credentials is valid', async () => {
      const { sut, validCredential } = await makeSut();

      const result = await sut.signIn(validCredential);

      expect(result).toBeDefined();
      expect(result.isRight()).toEqual(true);
      expect(result.value).toBeInstanceOf(Token);
      if (result.isRight()) {
        expect(result.value.props.expiresIn).toBeDefined();
        expect(result.value.props.token).toBeDefined();
      }
    });
  });
});
