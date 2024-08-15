import { Left, left, Right, right } from './either';
import Inspetor, { InspetorError } from './inspetor';

describe('Inspetor', () => {
  const makeSut = () => {
    const sut = Inspetor;

    return { sut };
  };

  describe('combine', () => {
    test('Should return left when some result isLeft', () => {
      const { sut } = makeSut();

      const result = sut.combine([left(''), right('')]);

      expect(result.isLeft()).toBe(true);
      expect(result).toBeInstanceOf(Left);
    });
    test('Should return rigth when any result isRigth', () => {
      const { sut } = makeSut();

      const result = sut.combine([right(''), right('')]);

      expect(result.isRight()).toBe(true);
      expect(result).toBeInstanceOf(Right);
    });
  });

  describe('greaterThan', () => {
    test('SHould return left containing InspectorError when value is not greater then minValue', () => {
      const { sut } = makeSut();

      const result = sut.greaterThan(10, 9.99999);

      expect(result.isLeft()).toBe(true);
      expect(result).toBeInstanceOf(Left);
      expect(result.value).toBeInstanceOf(InspetorError);
    });

    test('SHould return rigth when value is greater then minValue', () => {
      const { sut } = makeSut();

      const result = sut.greaterThan(9.999998, 9.999999);

      expect(result.isRight()).toBe(true);
      expect(result).toBeInstanceOf(Right);
    });
  });

  describe('againstAtLeast', () => {
    test('SHould return left when string is not at least numChars', () => {
      const { sut } = makeSut();

      const result = sut.againstAtLeast(4, 'abc');

      expect(result.isLeft()).toBe(true);
      expect(result).toBeInstanceOf(Left);
      expect(result.value).toBeInstanceOf(InspetorError);
    });

    test('SHould return rigth when string is at least numChars', () => {
      const { sut } = makeSut();

      const result1 = sut.againstAtLeast(3, 'abc');
      const result2 = sut.againstAtLeast(3, 'abcd');

      expect(result1.isRight()).toBe(true);
      expect(result2.isRight()).toBe(true);
      expect(result1).toBeInstanceOf(Right);
      expect(result2).toBeInstanceOf(Right);
    });
  });

  describe('againstAtMost', () => {
    test('SHould return left when string is greater then numChars', () => {
      const { sut } = makeSut();

      const result = sut.againstAtMost(3, 'abcd');

      expect(result.isLeft()).toBe(true);
      expect(result).toBeInstanceOf(Left);
      expect(result.value).toBeInstanceOf(InspetorError);
    });

    test('SHould return rigth when string is not greater then numChar', () => {
      const { sut } = makeSut();

      const result1 = sut.againstAtMost(3, 'abc');
      const result2 = sut.againstAtMost(3, 'ab');

      expect(result1.isRight()).toBe(true);
      expect(result2.isRight()).toBe(true);
      expect(result1).toBeInstanceOf(Right);
      expect(result2).toBeInstanceOf(Right);
    });
  });

  describe('againstNullOrUndefined', () => {
    test('Should return left when argument is null or undefined', () => {
      const { sut } = makeSut();

      const result1 = sut.againstNullOrUndefined(null, 'null');
      const result2 = sut.againstNullOrUndefined(undefined, 'null');

      expect(result1.isLeft()).toBe(true);
      expect(result2.isLeft()).toBe(true);
      expect(result1).toBeInstanceOf(Left);
      expect(result2).toBeInstanceOf(Left);
      expect(result1.value).toBeInstanceOf(InspetorError);
      expect(result2.value).toBeInstanceOf(InspetorError);
    });
    test('Should return rigth when argument is not null or undefined', () => {
      const { sut } = makeSut();

      const result1 = sut.againstNullOrUndefined(123, 'number');
      const result2 = sut.againstNullOrUndefined('string', 'string');
      const result3 = sut.againstNullOrUndefined({}, 'object');
      const result4 = sut.againstNullOrUndefined([], 'array');

      expect(result1.isRight()).toBe(true);
      expect(result2.isRight()).toBe(true);
      expect(result3.isRight()).toBe(true);
      expect(result4.isRight()).toBe(true);
      expect(result1).toBeInstanceOf(Right);
      expect(result2).toBeInstanceOf(Right);
      expect(result3).toBeInstanceOf(Right);
      expect(result4).toBeInstanceOf(Right);
    });
  });

  describe('againstNullOrUndefinedBulk', () => {
    test('Should return left when some argument is null or undefined', () => {
      const { sut } = makeSut();

      const result1 = sut.againstNullOrUndefinedBulk([
        { argument: undefined, argumentName: 'undefined' },
        { argument: 121, argumentName: 'notUndefined' },
      ]);
      const result2 = sut.againstNullOrUndefinedBulk([
        { argument: null, argumentName: 'null' },
        { argument: 121, argumentName: 'notUndefined' },
      ]);

      expect(result1).toBeInstanceOf(Left);
      expect(result1.isLeft()).toBe(true);
      expect(result1.value).toBeInstanceOf(InspetorError);
      expect(result2).toBeInstanceOf(Left);
      expect(result2.isLeft()).toBe(true);
      expect(result2.value).toBeInstanceOf(InspetorError);
    });
    test('Should return rigth when all arguments is not null or undefined', () => {
      const { sut } = makeSut();

      const result1 = sut.againstNullOrUndefinedBulk([
        { argument: 'string', argumentName: 'string' },
        { argument: 121, argumentName: 'notUndefined' },
      ]);

      const result2 = sut.againstNullOrUndefinedBulk([
        { argument: 'string', argumentName: 'string' },
        { argument: 121, argumentName: 'notUndefined' },
      ]);

      expect(result1).toBeInstanceOf(Right);
      expect(result1.isLeft()).toBe(false);
      expect(result2).toBeInstanceOf(Right);
      expect(result2.isLeft()).toBe(false);
    });
  });

  describe('isOneOf', () => {
    test('Should return left when value is not valid', () => {
      const { sut } = makeSut();

      const result = sut.isOneOf(
        'notValid',
        ['valid', 'valid1', 1, 2, 3, {}, []],
        'notValid',
      );

      expect(result.isLeft()).toBe(true);
      expect(result).toBeInstanceOf(Left);
      expect(result.value).toBeInstanceOf(InspetorError);
    });
  });

  test('Should return rigth when valus is valid', () => {
    const { sut } = makeSut();

    const result = sut.isOneOf(
      'valid',
      ['valid', 'valid1', 1, 2, 3, {}, []],
      'valid',
    );

    expect(result.isLeft()).toBe(false);
    expect(result).toBeInstanceOf(Right);
  });
});
