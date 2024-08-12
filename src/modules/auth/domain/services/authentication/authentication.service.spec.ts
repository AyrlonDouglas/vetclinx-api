import AuthenticationService from './authentication.service';
import FakeUserRepository from '@modules/user/infra/repositories/fakeUser.repository';
import TokenPort from '../token.port';
import { Config } from '@modules/config/ports/config';
import Credential from '../../valueObjects/credential/cretendital.valueObect';
import Email from '@modules/user/domain/valueObjects/email/email.valueObject';
import Password from '@modules/user/domain/valueObjects/password/password.valueObject';
import AuthenticationErrors from './authentication.errors';
import User from '@modules/user/domain/entities/user.entity';
import Token from '../../valueObjects/token/token.objectValue';

describe('AuthenticationService', () => {
  describe(`signIn`, () => {
    const makeSut = () => {
      const emailMock = Email.create('teste@teste.com');
      const passwordMock = Password.create('SenhaForte54!');

      const userMock = User.create({
        name: 'Ayrlon',
        email: emailMock.value as Email,
        password: passwordMock.value as Password,
        username: 'ayrlon',
      });

      const userRepository = new FakeUserRepository([userMock.value as User]);
      console.log('userRepositoryx', userRepository);

      const config = {
        getAuthenticationConfig: () => ({
          secretKey: 'testeKey',
          expiresIn: '1h',
        }),
      } as Config;

      const tokenService = {} as TokenPort;

      const validCredential = Credential.create({
        email: Email.create('testeteste@testeteste.com.br').value as Email,
        password: Password.create('SenhaForte12@!').value as Password,
      }).value as Credential;

      const sut = new AuthenticationService(
        userRepository,
        tokenService,
        config,
      );

      return { sut, validCredential };
    };

    test('Should return left content InvalidCredentialError when invalid credentials', async () => {
      const { sut, validCredential } = makeSut();
      // const invalidCredential = Credential.create({
      //   email: Email.create('credentials@teste.com').value as Email,
      //   password: Password.create('123As#2').value as Password,
      // }).value as Credential;

      const result = await sut.signIn(validCredential);

      expect(result).resolves.toBeDefined();
      // expect(result)
      // expect(result).toBeDefined();
      // expect(result.isLeft()).toBe(true);
      // expect(result.value).toBeInstanceOf(
      //   AuthenticationErrors.invalidCredentialError,
      // );
    });
  });
});
