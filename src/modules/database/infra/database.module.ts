import { Module } from '@nestjs/common';
import { postgreSQLModule } from './posgreSQL/postgreSQL.module';
import { UserRepository } from '@modules/user/application/repositories/user.repository';
import { UserPostgreRepository } from '@modules/user/infra/repositories/userPostgre.repository';

@Module({
  imports: [...postgreSQLModule],
  exports: [...postgreSQLModule, UserRepository],
  providers: [{ provide: UserRepository, useClass: UserPostgreRepository }],
})
export class DatabaseModule {}
