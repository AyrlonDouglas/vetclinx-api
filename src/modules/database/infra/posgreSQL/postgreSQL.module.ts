import { Environment } from '@modules/config/config.interface';
import { ConfigsModule } from '@modules/config/infra/config.module';
import { Config } from '@modules/config/ports/config';
import { User } from '@modules/database/infra/posgreSQL/entities/user.db.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

export const postgreSQLModule = [
  TypeOrmModule.forRootAsync({
    imports: [ConfigsModule],
    useFactory: (configService: Config) => {
      const appConfig = configService.getAppConfig();
      const dbConfig = configService.getDatabaseConfig();
      const isDev = appConfig.env === Environment.dev;

      return {
        type: 'postgres',
        host: dbConfig.postgreSQL.host,
        port: +dbConfig.postgreSQL.port,
        username: dbConfig.postgreSQL.username,
        password: dbConfig.postgreSQL.password,
        database: dbConfig.postgreSQL.database,
        synchronize: true,
        autoLoadEntities: true,
        logging: isDev,
      };
    },
    inject: [Config],
  }),
  TypeOrmModule.forFeature([User]),
];
