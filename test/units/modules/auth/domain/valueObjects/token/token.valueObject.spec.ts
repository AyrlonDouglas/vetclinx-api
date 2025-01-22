import Token, {
  TokenError,
} from '@modules/auth/domain/valueObjects/token/token.valueObject';

describe('Token', () => {
  const makeSut = () => {
    const token = 'token';
    const expiresIn = '1h';

    const sut = Token.create;
    return {
      sut,
      token,
      expiresIn,
    };
  };

  test('Should return token when input valid email and password', () => {
    const { sut, expiresIn, token } = makeSut();

    const result = sut({ expiresIn, token });

    expect(result).toBeDefined();
    expect(result.value).toBeInstanceOf(Token);
    expect(result.isRight()).toBe(true);
    if (result.isRight()) {
      expect(result.value.props.expiresIn).toEqual(expiresIn);
      expect(result.value.props.token).toEqual(token);
    }
  });

  test('Should return left with InspectorError when some input is invalid', () => {
    const { sut, expiresIn, token } = makeSut();

    const result1 = sut({ expiresIn: '', token });
    const result2 = sut({ expiresIn: expiresIn, token: '' });

    expect(result1.isLeft()).toBe(true);
    expect(result1.value).toBeInstanceOf(TokenError);
    expect(result2.isLeft()).toBe(true);
    expect(result2.value).toBeInstanceOf(TokenError);
  });
});
