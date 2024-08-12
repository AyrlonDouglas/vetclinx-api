import { registerAs } from '@nestjs/config';
import {
  AppConfig,
  AuthConfig,
  ConfigKey,
  DatabaseConfig,
  Environment,
} from '../config.interface';

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
    mongoDB: { uri: process.env.DATABASE_MONGODB_CONNECT_URL },
  }),
);

const AuthConfig = registerAs(
  ConfigKey.auth,
  (): AuthConfig => ({
    expiresIn: process.env.AUTH_EXPIRES_IN,
    secretKey: process.env.AUTH_SECRET_KEY,
  }),
);

export const configurations = [AppConfig, DatabaseConfig, AuthConfig];
