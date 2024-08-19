import { InspetorError } from '@common/core/inspetor';
import User from '@modules/user/domain/entities/user.entity';
import Email from '@modules/user/domain/valueObjects/email/email.valueObject';
import Password from '@modules/user/domain/valueObjects/password/password.valueObject';

describe('User', () => {
  describe('User.create()', () => {
    const makeSut = () => {
      const emailOrFail = Email.create('teste@tetse.com');
      if (emailOrFail.isLeft()) {
        throw new Error('Email invalid');
      }
      const password = Password.create('SenhaValida12#$').value as Password;

      const email = emailOrFail.value;
      const inputCreate = {
        email,
        name: 'a',
        password,
        username: 'aa',
      };

      const sut = User.create;

      return { sut, inputCreate };
    };

    test('Should create a new user when all props are passed', () => {
      const { inputCreate, sut } = makeSut();

      const result = sut(inputCreate);

      expect(result).toBeTruthy();
      expect(result.isRight()).toBe(true);
      if (result.isRight()) {
        expect(result.value.props.email).toBe(inputCreate.email);
        expect(result.value.props.name).toBe(inputCreate.name);
        expect(result.value.props.password).toBe(inputCreate.password);
        expect(result.value.props.username).toBe(inputCreate.username);
      }
    });

    test('Should return left when not all props are passed', () => {
      const { inputCreate, sut } = makeSut();

      const result = sut({ ...inputCreate, email: null });

      expect(result.isLeft()).toBe(true);
      expect(result.value).toBeInstanceOf(InspetorError);
    });
  });
});
