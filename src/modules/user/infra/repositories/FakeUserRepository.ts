import User from '../../domain/entities/User';
import { UserRepository } from '../../application/repositories/UserRepository';

export default class FakeUserRepository implements UserRepository {
  constructor(private readonly userList: User[] = []) {}

  async findByEmail(email: string): Promise<User> {
    return this.userList.find(
      (user) => user.props.email === email.toLowerCase().trim(),
    );
  }

  async findByUsername(username: string): Promise<User> {
    return this.userList.find((user) => user.props.username === username);
  }

  async findById(id: number): Promise<User> {
    return this.userList.find((user) => user.props.id === id);
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
