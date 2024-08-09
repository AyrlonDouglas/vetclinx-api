import User from '../../domain/entities/user.entity';
import { UserRepository } from '../../application/repositories/user.repository';
import Email from '@modules/user/domain/valueObjects/email.valueObject';
import { randomUUID } from 'crypto';

export default class FakeUserRepository implements UserRepository {
  private readonly userList: User[] = [
    User.create({
      name: 'Ayrlon',
      email: {} as Email,
      password: '123',
      username: 'ayrlon',
      id: randomUUID().toString(),
    }).value as User,
  ];

  constructor(userList: User[] = []) {
    userList.forEach((user) => this.userList.push(user));
  }

  async findAll(): Promise<User[]> {
    return this.userList;
  }

  async findByEmail(email: string): Promise<User> {
    return (
      this.userList.find(
        (user) => user.props.email === email.toLowerCase().trim(),
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
    const emailData = Email.create(user.props.email);
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

  async remove(id: string): Promise<void> {
    const indexFound = this.userList.findIndex((user) => user.props.id === id);
    if (indexFound === -1) return;

    this.userList.splice(indexFound, 1);
  }
}
