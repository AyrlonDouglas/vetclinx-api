import User from '@modules/user/domain/entities/user.entity';
import { Mapper } from '@shared/infra/Mapper';
import { UserDocument } from '../schemas/user.schema';
import Email from '@modules/user/domain/valueObjects/email.valueObject';

export class UserMongooseMapper implements Mapper<User> {
  toPersistense(user: User): any {
    return {
      email: user.props.email,
      name: user.props.name,
      username: user.props.username,
      password: user.props.password,
    };
  }

  toDomain(user: UserDocument): User {
    return User.create({
      email: Email.create(user.email).value as Email,
      name: user.name,
      password: user.password,
      username: user.username,
      id: user.id,
    }).value as User;
  }
}
