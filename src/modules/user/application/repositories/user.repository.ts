import User from '../../domain/entities/user.entity';

export abstract class UserRepository {
  abstract findById(id: string): Promise<User | null>;
  abstract findByUsername(username: string): Promise<User | null>;
  abstract findByEmail(email: string): Promise<User | null>;
  abstract save(user: User): Promise<string>;
  abstract remove(id: string): Promise<void>;
  abstract findAll(): Promise<User[]>;
}
