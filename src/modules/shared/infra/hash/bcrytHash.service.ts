import HashService from '@modules/shared/domain/hash.service';
import { Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';

// TODO: Fazer testes
@Injectable()
export default class BcryptHashService implements HashService {
  async genSalt(round: number): Promise<string> {
    return bcrypt.genSalt(round);
  }

  async hash(
    data: string | Buffer,
    saltOrRounds: string | number = 10,
  ): Promise<string> {
    return await bcrypt.hash(data, saltOrRounds);
  }

  async compare(data: string | Buffer, encrypted: string): Promise<boolean> {
    return await bcrypt.compare(data, encrypted);
  }
}
