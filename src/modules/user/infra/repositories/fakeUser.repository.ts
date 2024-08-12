import User from '../../domain/entities/user.entity';
import { UserRepository } from '../../application/repositories/user.repository';
import Email from '@modules/user/domain/valueObjects/email/email.valueObject';
import { randomUUID } from 'crypto';
import Password from '@modules/user/domain/valueObjects/password/password.valueObject';

export default class FakeUserRepository implements UserRepository {
  private readonly userList: User[] = [
    User.create({
      name: 'Ayrlon',
      email: Email.create('testeteste@testeteste.com.br').value as Email,
      password: Password.create('SenhaForte12@!').value as Password,
      username: 'ayrlon',
      id: randomUUID().toString(),
    }).value as User,
  ];

  constructor(users: User[] = []) {
    users.forEach((user) => this.userList.push(user));
  }

  async findAll(): Promise<User[]> {
    return this.userList;
  }

  async findByEmail(email: string): Promise<User> {
    return (
      this.userList.find(
        (user) => user.props.email.value === email.toLowerCase().trim(),
      ) ?? null
    );
  }

  async findByUsername(username: string): Promise<User> {
    return (
      this.userList.find((user) => user.props.username === username) ?? null
    );
  }

  async findById(id: string): Promise<User> {
    return this.userList.find((user) => user.props.id === id) ?? null;
  }

  async save(user: User): Promise<string> {
    const emailData = Email.create(user.props.email.value);
    if (emailData.isLeft()) return '0';

    const userData = User.create({
      email: emailData.value,
      name: user.props.name,
      password: user.props.password,
      username: user.props.username,
      id: randomUUID().toString(),
    });

    if (userData.isLeft()) {
      return '0';
    }

    this.userList.push(userData.value);
    return userData.value.props.id;
  }

  async removeById(id: string): Promise<string | null> {
    const indexFound = this.userList.findIndex((user) => user.props.id === id);
    if (indexFound === -1) return null;
    this.userList.splice(indexFound, 1);
    return id;
  }
}
