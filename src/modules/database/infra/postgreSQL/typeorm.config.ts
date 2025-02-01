import { DataSource } from 'typeorm';
import { SnakeNamingStrategy } from 'typeorm-naming-strategies';
import { ConfigService } from '@nestjs/config';

import { config } from 'dotenv';

// HACK: Esse arquivo é utilizado para gerenciar as migrações

config({
  path: `src/modules/config/envs/.env.${process.env.NODE_ENV || 'dev'}`,
});

const configService = new ConfigService();

export default new DataSource({
  type: 'postgres',
  host: configService.get<string>('DATABASE_POSTGRE_HOST'),
  port: configService.get<number>('DATABASE_POSTGRE_PORT'),
  username: configService.get<string>('DATABASE_POSTGRE_USERNAME'),
  password: configService.get<string>('DATABASE_POSTGRE_PASSWORD'),
  database: configService.get<string>('DATABASE_POSTGRE_DATABASE'),
  logging: true,
  namingStrategy: new SnakeNamingStrategy(),
  useUTC: true,

  // Configuração de migrações
  synchronize: false,
  entities: [__dirname + '/entities/**/*.db.entity{.ts,.js}'],
  migrations: [__dirname + '/migrations/*.ts'],
});
