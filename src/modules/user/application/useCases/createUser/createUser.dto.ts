import { countries } from '@common/constants/countries';
import {
  UserStatus,
  UserType,
} from '@modules/user/domain/entities/user.entity';

export interface CreateUserDTO {
  name: string;
  username: string;
  email: string;
  password: string;
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
