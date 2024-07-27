import User from '../../domain/entities/user.entity';
import { UserRepository } from '../../application/repositories/user.repository';
import Email from '@modules/user/domain/valueObjects/email.valueObject';

export default class FakeUserRepository implements UserRepository {
  private readonly userList: User[] = [
    User.create({
      name: 'Ayrlon',
      email: {} as Email,
      password: '123',
      username: 'ayrlon',
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

  async findById(id: number): Promise<User> {
    return this.userList.find((user) => user.props.id === id) ?? null;
  }

  async save(user: User): Promise<number> {
    user.props.id = Math.random();
    this.userList.push(user);
    return user.props.id;
  }

  async remove(id: number): Promise<void> {
    const indexFound = this.userList.findIndex((user) => user.props.id === id);
    if (indexFound === -1) return;

    this.userList.splice(indexFound, 1);
  }
}
