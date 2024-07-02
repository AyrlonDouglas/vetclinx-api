import User from '../../domain/entities/User';

export interface UserRepository {
  findById(id: number): Promise<User | null>;
  findByUsername(username: string): Promise<User | null>;
  findByEmail(email: string): Promise<User | null>;
  save(user: User): Promise<number>;
  remove(id: number): Promise<void>;
}
