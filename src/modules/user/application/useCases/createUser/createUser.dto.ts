import { countries } from '@common/constants/countries';
import {
  UserStatus,
  UserType,
} from '@modules/user/domain/entities/user.entity';

export class CreateUserDTO {
  name: string;
  username: string;
  email: string;
  password: string;
  status: keyof typeof UserStatus;
  phoneNumber?: string;
  birthDate: Date;
  userType: keyof typeof UserType;
  institution: string;
  graduationDate: Date;
  specialization?: string[];
  professionalRegistration?: string;
  country: (typeof countries)[number]['alpha3'];
}
