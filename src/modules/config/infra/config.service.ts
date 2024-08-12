import { ConfigService as ConfigServiceNest } from '@nestjs/config';
import {
  AppConfig,
  AuthConfig,
  ConfigKey,
  DatabaseConfig,
} from '../config.interface';
import { Injectable } from '@nestjs/common';
import { Config } from '../ports/config';

@Injectable()
export default class ConfigService implements Config {
  constructor(private readonly configServiceNest: ConfigServiceNest) {}

  getAppConfig() {
    return this.configServiceNest.get<AppConfig>(ConfigKey.app);
  }

  getDatabaseConfig() {
    return this.configServiceNest.get<DatabaseConfig>(ConfigKey.app);
  }

  getAuthenticationConfig() {
    return this.configServiceNest.get<AuthConfig>(ConfigKey.auth);
  }
}
