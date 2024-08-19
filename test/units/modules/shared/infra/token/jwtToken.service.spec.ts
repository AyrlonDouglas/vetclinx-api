import { PayloadToken } from '@modules/shared/domain/token.service';
import JWTTokenService from '@modules/shared/infra/token/jwtToken.service';
import TokenServiceErrors from '@modules/shared/infra/token/jwtToken.service.errors';

describe('JWTTokenService', () => {
  describe(`create`, () => {
    const makeSut = () => {
      const payload = { userId: '123' };
      const secretKey = 'secretKeyTest';
      const config = { expiresIn: '1h' };

      const sut = new JWTTokenService().create;

      return { sut, payload, secretKey, config };
    };

    test('Should be return a token when input is valid', async () => {
      const { sut, config, payload, secretKey } = makeSut();

      const result = await sut({ payload, secretKey, config });

      expect(result).toBeDefined();
      expect(result.isRight()).toBe(true);
      if (result.isRight()) {
        expect(result.value.props.expiresIn).toEqual(config.expiresIn);
        expect(result.value.props.token).not.toEqual(payload);
      }
    });

    test('Should be return a TokenServiceInvalidInputError when input is invalid', async () => {
      const { sut, payload, secretKey } = makeSut();

      const result1 = await sut({ payload: {} as PayloadToken, secretKey });
      const result2 = await sut({ payload, secretKey: '' });

      expect(result1).toBeDefined();
      expect(result1.isLeft()).toBe(true);
      expect(result1.value).toBeInstanceOf(
        TokenServiceErrors.InvalidInputError,
      );

      expect(result2).toBeDefined();
      expect(result2.isLeft()).toBe(true);
      expect(result2.value).toBeInstanceOf(
        TokenServiceErrors.InvalidInputError,
      );
    });
  });
});
