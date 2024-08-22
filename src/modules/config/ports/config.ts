import { AppConfig, AuthConfig, DatabaseConfig } from '../config.interface';

export abstract class Config {
  abstract getAppConfig: () => AppConfig;
  abstract getDatabaseConfig: () => DatabaseConfig;
  abstract getAuthenticationConfig: () => AuthConfig;
}
