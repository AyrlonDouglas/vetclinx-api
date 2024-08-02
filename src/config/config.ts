import { registerAs } from '@nestjs/config';
import {
  AppConfig,
  ConfigKey,
  DatabaseConfig,
  Environment,
} from './config.interface';

const AppConfig = registerAs(
  ConfigKey.app,
  (): AppConfig => ({
    env: Environment[process.env.NODE_ENV] || Environment.dev,
    port: Number(process.env.APP_PORT),
    appName: process.env.APP_NAME,
  }),
);

const DatabaseConfig = registerAs(
  ConfigKey.db,
  (): DatabaseConfig => ({
    host: process.env.DATABASE_HOST,
    port: Number(process.env.DATABASE_PORT),
    username: process.env.DATABASE_USERNAME,
    password: process.env.DATABASE_PASSWORD,
    database: process.env.DATABASE,
  }),
);

export const configurations = [AppConfig, DatabaseConfig];
