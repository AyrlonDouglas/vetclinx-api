import { InspectorError } from '@common/core/inspector';
import User, {
  UserCreateInput,
  UserStatus,
  UserType,
} from '@modules/user/domain/entities/user.entity';
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
      const inputCreate: UserCreateInput = {
        email,
        name: 'a',
        password,
        username: 'aa',
        birthDate: new Date('1996-04-16'),
        country: 'bra',
        graduationDate: new Date(),
        institution: 'UFRPE',
        status: UserStatus.active,
        userType: UserType.student,
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
        expect(result.value.props.birthDate).toBe(inputCreate.birthDate);
        expect(result.value.props.country).toBe(inputCreate.country);
        expect(result.value.props.graduationDate).toBe(
          inputCreate.graduationDate,
        );
        expect(result.value.props.institution).toBe(inputCreate.institution);
        expect(result.value.props.status).toBe(inputCreate.status);
        expect(result.value.props.userType).toBe(inputCreate.userType);
      }
    });

    test('Should return left when not all props are passed', () => {
      const { inputCreate, sut } = makeSut();

      const result = sut({ ...inputCreate, email: null });

      expect(result.isLeft()).toBe(true);
      expect(result.value).toBeInstanceOf(InspectorError);
    });

    test('Should return left when userType not to be some UserType valid', () => {
      const { inputCreate, sut } = makeSut();

      const result = sut({
        ...inputCreate,
        userType: 'invalidUserTye' as keyof typeof UserType,
      });

      expect(result.isLeft()).toBe(true);
      expect(result.value).toBeInstanceOf(InspectorError);
    });

    test('Should return left when status not to be some userStatus valid', () => {
      const { inputCreate, sut } = makeSut();

      const result = sut({
        ...inputCreate,
        status: 'invalidStatus' as keyof typeof UserStatus,
      });

      expect(result.isLeft()).toBe(true);
      expect(result.value).toBeInstanceOf(InspectorError);
    });
  });
});
