import { Config } from '../ports/config';
import ConfigService from './config.service';
import { ConfigService as ConfigServiceNest } from '@nestjs/config';

export const configProvider = {
  provide: Config,
  useFactory: (configServiceNest: ConfigServiceNest) =>
    new ConfigService(configServiceNest),
  inject: [ConfigServiceNest],
};
