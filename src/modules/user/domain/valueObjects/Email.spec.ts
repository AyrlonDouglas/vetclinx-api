import Email, { EmailError } from './Email';

describe('Email', () => {
  describe('Email.create()', () => {
    const makeSut = () => {
      const sut = Email.create;
      return { sut };
    };

    test('Should return a rigth containing an Email when the email is valid', () => {
      const email = 'test@test.com';
      const { sut } = makeSut();

      const result = sut(email);

      expect(result).toBeTruthy();
      expect(result.isRight()).toBe(true);
      if (result.isRight()) {
        expect(result.value.value).toBe(email);
      }
    });

    test('Should return a rigth containing an Email when the email containgn white spaces', () => {
      const email = '   test@test.com   ';
      const { sut } = makeSut();

      const result = sut(email);

      expect(result).toBeTruthy();
      expect(result.isRight()).toBe(true);
      if (result.isRight()) {
        expect(result.value.value).toBe(email.toLowerCase().trim());
      }
    });

    test('Should return a left containing an EmailError when the email not is valid', () => {
      const emailInvalid1 = '   testtest.com   ';
      const emailInvalid2 = 'test@testcom';
      const emailInvalid3 = '   testtestcom   ';
      const emailInvalid4 = '      ';
      const emailInvalid5 = null;
      const { sut } = makeSut();

      const result1 = sut(emailInvalid1);
      const result2 = sut(emailInvalid2);
      const result3 = sut(emailInvalid3);
      const result4 = sut(emailInvalid4);
      const result5 = sut(emailInvalid5);

      expect(result1.isRight()).toBe(false);
      expect(result2.isRight()).toBe(false);
      expect(result3.isRight()).toBe(false);
      expect(result4.isRight()).toBe(false);
      expect(result5.isRight()).toBe(false);
      if (result1.isLeft()) {
        expect(result1.value).toBeInstanceOf(EmailError);
      }
    });
  });
});
