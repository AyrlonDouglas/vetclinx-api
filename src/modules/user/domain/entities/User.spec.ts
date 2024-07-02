import { InspetorError } from '@shared/core/Inspetor';
import Email from '../valueObjects/Email';
import User from './User';

describe('User', () => {
  describe('User.create()', () => {
    const makeSut = () => {
      const emailOrFail = Email.create('teste@tetse.com');
      if (emailOrFail.isLeft()) {
        throw new Error('Email invalid');
      }
      const email = emailOrFail.value;
      const inputCreate = {
        email,
        name: 'a',
        password: 'a',
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
        expect(result.value.props.email).toBe(inputCreate.email.value);
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
