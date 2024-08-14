import Password from '@modules/user/domain/valueObjects/password/password.valueObject';
import Credential, { CredentialError } from './credential.valueObject';
import Email from '@modules/user/domain/valueObjects/email/email.valueObject';

describe('Credential', () => {
  const makeSut = () => {
    const passwordOrFail = Password.create('SenhaForte12@');
    const emailOrFail = Email.create('testando@teste.com.br');

    if (passwordOrFail.isLeft()) throw new Error('invalid password');
    if (emailOrFail.isLeft()) throw new Error('invalid email');

    const sut = Credential.create;
    return {
      sut,
      validPassord: passwordOrFail.value,
      validEmail: emailOrFail.value,
    };
  };

  test('Should return credential when input valid email and password', () => {
    const { sut, validEmail, validPassord } = makeSut();

    const result = sut({ email: validEmail, password: validPassord });

    expect(result).toBeDefined();
    expect(result.value).toBeInstanceOf(Credential);
    expect(result.isRight()).toBe(true);
    if (result.isRight()) {
      expect(result.value.props.email).toEqual(validEmail);
      expect(result.value.props.password).toEqual(validPassord);
    }
  });

  test('Should return left with InspectorError when some input is invalid', () => {
    const { sut, validEmail, validPassord } = makeSut();

    const result1 = sut({ email: validEmail, password: {} as Password });
    const result2 = sut({ email: {} as Email, password: validPassord });

    expect(result1.isLeft()).toBe(true);
    expect(result1.value).toBeInstanceOf(CredentialError);
    expect(result2.isLeft()).toBe(true);
    expect(result2.value).toBeInstanceOf(CredentialError);
  });
});
