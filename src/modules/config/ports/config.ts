import { AppConfig, AuthConfig, DatabaseConfig } from '../config.interface';

export abstract class Config {
  getAppConfig: () => AppConfig;
  getDatabaseConfig: () => DatabaseConfig;
  getAuthenticationConfig: () => AuthConfig;
}
