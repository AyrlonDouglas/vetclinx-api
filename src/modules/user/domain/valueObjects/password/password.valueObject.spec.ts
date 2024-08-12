import Password, { PasswordError } from './password.valueObject';

describe('Password.create', () => {
  const makeSut = () => {
    const pass = {
      valid: 'SenhaForte123!',
      invalid: {
        1: 'senha',
        2: 'senhasenha1',
        3: 'senhasenha!',
        4: 'Senhasenha1',
        5: 'Senhasenha1',
        6: '!!!!!!!!!',
        7: 'senha1!',
      },
      validWithWhiteSpaces: '     SenhaForte123!    ',
    };

    const sut = Password.create;

    return { sut, pass };
  };

  test('Should return right with password when password is valid', () => {
    const { pass, sut } = makeSut();
    const result = sut(pass.valid);

    expect(result).toBeDefined();
    expect(result.isRight()).toBe(true);
    expect(result.value).toBeInstanceOf(Password);
    if (result.isRight()) {
      expect(result.value.value).toBe(pass.valid);
    }
  });

  test('Should return right with password when password is valid  and containgn white spaces', () => {
    const { pass, sut } = makeSut();
    const result = sut(pass.validWithWhiteSpaces);

    expect(result).toBeDefined();
    expect(result.isRight()).toBe(true);
    expect(result.value).toBeInstanceOf(Password);
    if (result.isRight()) {
      expect(result.value.value).toBe(pass.valid);
    }
  });

  test('Should return left with error when password is not valid', () => {
    const { pass, sut } = makeSut();

    for (const invalidPass of Object.values(pass.invalid)) {
      const result = sut(invalidPass);

      expect(result).toBeDefined();
      expect(result.isRight()).toBe(false);
      expect(result.value).toBeInstanceOf(PasswordError);
    }
  });
});
