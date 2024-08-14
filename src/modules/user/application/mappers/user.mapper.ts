import User from '@modules/user/domain/entities/user.entity';
import { Mapper } from '@common/infra/Mapper';
import { UserDocument } from '../../infra/schemas/user.schema';
import Email from '@modules/user/domain/valueObjects/email/email.valueObject';
import Password from '@modules/user/domain/valueObjects/password/password.valueObject';

export class UserMapper implements Mapper<User> {
  toPersistense(user: User): any {
    return {
      email: user.props.email.value,
      name: user.props.name,
      username: user.props.username,
      password: user.props.password.value,
    };
  }

  toDomain(user: UserDocument): User {
    return User.create({
      email: Email.create(user.email).value as Email,
      name: user.name,
      password: Password.create(user.password, false).value as Password,
      username: user.username,
      id: user.id,
    }).value as User;
  }

  toDTO(user: User): UserDTO {
    return new UserDTO({
      id: user.props.id,
      email: user.props.email.value,
      name: user.props.name,
      username: user.props.username,
    });
  }
}

export class UserDTO {
  id: string;
  email: string;
  name: string;
  username: string;
  constructor(props: UserDTO) {
    Object.entries(props).forEach(([key, value]) => {
      (this as any)[key] = value;
    });
  }
}
