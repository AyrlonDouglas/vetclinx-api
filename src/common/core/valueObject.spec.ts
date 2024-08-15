import ValueObject from './valueObject';

describe('ValueObject', () => {
  const makeSut = () => {
    class ValueObjectTest extends ValueObject<string> {}
    const sut = new ValueObjectTest('testText');
    return { sut, ValueObjectTest };
  };
  describe('equals', () => {
    test('Should return false when vo is undefined or null', () => {
      const { sut } = makeSut();

      const result1 = sut.equals(null);
      const result2 = sut.equals(undefined);

      expect(result1).toBe(false);
      expect(result2).toBe(false);
    });

    test('Should return false when vo is different', () => {
      const { sut, ValueObjectTest } = makeSut();

      const result = sut.equals(new ValueObjectTest('diferrent'));

      expect(result).toBe(false);
    });
    test('Should return false when vo is equal', () => {
      const { sut, ValueObjectTest } = makeSut();

      const result = sut.equals(new ValueObjectTest('testText'));

      expect(result).toBe(true);
    });
  });
});
