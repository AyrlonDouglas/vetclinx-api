import HashService from '@modules/shared/domain/hash.service';
import { left, right } from '@common/core/either';
import PasswordFactory from '@modules/user/domain/valueObjects/password/password.factory';
import Password from '@modules/user/domain/valueObjects/password/password.valueObject';
import PasswordErrors from '@modules/user/domain/valueObjects/password/password.errors';

describe(`PasswordFactory`, () => {
  const makeSut = () => {
    const hashServiceMock = {
      hash: jest.fn(),
      compare: jest.fn(),
      genSalt: jest.fn(),
    } as HashService;

    const sut = new PasswordFactory(hashServiceMock);

    return { sut, hashServiceMock };
  };

  describe(`create`, () => {
    test('should return an error when the password is invalid', async () => {
      jest.spyOn(Password, 'isValid').mockReturnValue(false);
      const { sut } = makeSut();

      const result = await sut.create('invalid_password');

      expect(result.isLeft()).toBe(true);
      expect(result.value).toBeInstanceOf(PasswordErrors.InvalidPasswordError);
    });

    test('should return a Password object when the password is valid', async () => {
      const { hashServiceMock, sut } = makeSut();
      jest.spyOn(Password, 'isValid').mockReturnValue(true);
      jest
        .spyOn(Password, 'create')
        .mockReturnValue(
          right(Password.create('hashedPassword', false).value as Password),
        );
      jest
        .spyOn(hashServiceMock, 'hash')
        .mockResolvedValueOnce(`hashedPassword`);

      const result = await sut.create('valid_password');

      expect(result.isRight()).toBe(true);
      expect(result.value).toBeInstanceOf(Password);
      expect(hashServiceMock.hash).toHaveBeenCalledWith('valid_password');
    });

    test('should return an error when Password.create fails', async () => {
      const { hashServiceMock, sut } = makeSut();
      jest.spyOn(Password, 'isValid').mockReturnValue(true);
      jest
        .spyOn(Password, 'create')
        .mockReturnValue(left(new PasswordErrors.InvalidPasswordError()));
      jest
        .spyOn(hashServiceMock, 'hash')
        .mockResolvedValueOnce(`hashedPassword`);

      const result = await sut.create('valid_password');

      expect(result.isLeft()).toBe(true);
      expect(result.value).toBeInstanceOf(PasswordErrors.InvalidPasswordError);
    });
  });
});
