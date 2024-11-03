import User, {
  UserStatus,
  UserType,
} from '@modules/user/domain/entities/user.entity';
import { Mapper } from '@common/infra/Mapper';
import Email from '@modules/user/domain/valueObjects/email/email.valueObject';
import Password from '@modules/user/domain/valueObjects/password/password.valueObject';
import { UserModel } from '../schemas/user.schema';
import { Types } from 'mongoose';
import { countries } from '@common/constants/countries';

export class UserMapper implements Mapper<User> {
  toPersistense(user: User): UserModel {
    return {
      email: user.props.email.value,
      name: user.props.name,
      username: user.props.username,
      password: user.props.password.value,
      birthDate: user.props.birthDate,
      country: user.props.country,
      graduationDate: user.props.graduationDate,
      institution: user.props.institution,
      status: user.props.status,
      userType: user.props.userType,
      phoneNumber: user.props.phoneNumber,
      professionalRegistration: user.props.professionalRegistration,
      specialization: user.props.specialization,
    };
  }

  toDomain(user: UserModel & { _id: Types.ObjectId }): User {
    return User.create({
      email: Email.create(user.email).value as Email,
      name: user.name,
      password: Password.create(user.password, false).value as Password,
      username: user.username,
      id: user._id.toString(),
      birthDate: user.birthDate && new Date(user.birthDate),
      country: user.country,
      graduationDate: user.graduationDate && new Date(user.graduationDate),
      institution: user.institution,
      status: UserStatus.active,
      userType: UserType.student,
      phoneNumber: user.phoneNumber,
      professionalRegistration: user.professionalRegistration,
      specialization: user.specialization,
    }).value as User;
  }

  toDTO(user: User): UserDTO {
    return new UserDTO({
      id: user.props.id,
      email: user.props.email.value,
      name: user.props.name,
      username: user.props.username,
      birthDate: user.props.birthDate,
      country: user.props.country,
      graduationDate: user.props.graduationDate,
      institution: user.props.institution,
      status: user.props.status,
      userType: user.props.userType,
      phoneNumber: user.props.phoneNumber,
      professionalRegistration: user.props.professionalRegistration,
      specialization: user.props.specialization,
    });
  }
}

export class UserDTO {
  id: string;
  email: string;
  name: string;
  username: string;
  country: (typeof countries)[number]['alpha3'];
  birthDate: Date;
  userType: keyof typeof UserType;
  institution: string;
  status: keyof typeof UserStatus;
  phoneNumber?: string;
  graduationDate: Date;
  specialization?: string[];
  professionalRegistration?: string;

  constructor(props: UserDTO) {
    Object.entries(props).forEach(([key, value]) => {
      (this as any)[key] = value;
    });
  }
}
