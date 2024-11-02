import { Either, left, right } from '@common/core/either';
import Inspetor, { InspetorError } from '@common/core/inspetor';
import Email from '../valueObjects/email/email.valueObject';
import Password from '../valueObjects/password/password.valueObject';
import { countries } from '@common/constants/countries';
export default class User {
  private constructor(
    private name: string,
    private username: string,
    private email: Email,
    private password: Password,
    private status: keyof typeof UserStatus,
    private brithDate: Date,
    private userType: keyof typeof UserType,
    private institution: string,
    private graduationDate: Date,
    private country: (typeof countries)[number]['alpha3'],
    private specialization?: string[],
    private professionalRegistration?: string,
    private id?: string,
    private phoneNumber?: string,
  ) {}

  get props(): UserProps {
    return {
      name: this.name,
      username: this.username,
      email: this.email,
      password: this.password,
      id: this.id,
      status: this.status,
      phoneNumber: this.phoneNumber,
      brithDate: this.brithDate,
      userType: this.userType,
      institution: this.institution,
      graduationDate: this.graduationDate,
      specialization: this.specialization,
      professionalRegistration: this.professionalRegistration,
      country: this.country,
    };
  }

  static create(input: UserCreateInput): Either<InspetorError, User> {
    const inputOrFail = Inspetor.againstFalsyBulk([
      { argument: input.email, argumentName: 'email' },
      { argument: input.name, argumentName: 'name' },
      { argument: input.username, argumentName: 'username' },
      { argument: input.password, argumentName: 'password' },
    ]);

    if (inputOrFail.isLeft()) {
      return left(inputOrFail.value);
    }

    const user = new User(
      input.name,
      input.username,
      input.email,
      input.password,
      input.status,
      input.brithDate,
      input.userType,
      input.institution,
      input.graduationDate,
      input.country,
      input.specialization,
      input.professionalRegistration,
      input.id,
      input.phoneNumber,
    );

    return right(user);
  }
}

interface UserProps {
  name: string;
  username: string;
  email: Email;
  password: Password;
  id?: string;
  status: keyof typeof UserStatus;
  phoneNumber?: string;
  brithDate: Date;
  userType: keyof typeof UserType;
  institution: string;
  graduationDate: Date;
  specialization?: string[];
  professionalRegistration?: string;
  country: (typeof countries)[number]['alpha3'];
}

export interface UserCreateInput extends UserProps {}

export const UserStatus = {
  active: 'active',
  inactive: 'inactive',
} as const;

export const UserType = {
  student: 'student',
  veterinarian: 'veterinarian',
} as const;
