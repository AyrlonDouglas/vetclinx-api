import { CreateUserDTO } from '@modules/user/application/useCases/createUser/createUser.dto';

export class CreateRequestDTO implements CreateUserDTO {
  name: string;
  username: string;
  email: string;
  password: string;
  status: 'active' | 'inactive';
  phoneNumber?: string;
  birthDate: Date;
  userType: 'student' | 'veterinarian';
  institution: string;
  graduationDate: Date;
  specialization?: string[];
  professionalRegistration?: string;
  country: string;
}
