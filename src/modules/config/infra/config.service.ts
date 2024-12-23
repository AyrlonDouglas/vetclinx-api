import { ConfigService as ConfigServiceNest } from '@nestjs/config';
import {
  AppConfig,
  AuthConfig,
  ConfigKey,
  DatabaseConfig,
} from '../config.interface';
import { Injectable, INestApplication } from '@nestjs/common';
import { Config } from '../ports/config';
import {
  DocumentBuilder,
  SwaggerCustomOptions,
  SwaggerModule,
} from '@nestjs/swagger';
import { SwaggerTheme, SwaggerThemeNameEnum } from 'swagger-themes';

@Injectable()
export default class ConfigService implements Config {
  constructor(private readonly configServiceNest: ConfigServiceNest) {}

  getAppConfig() {
    return this.configServiceNest.get<AppConfig>(ConfigKey.app);
  }

  getDatabaseConfig() {
    return this.configServiceNest.get<DatabaseConfig>(ConfigKey.db);
  }

  getAuthenticationConfig() {
    return this.configServiceNest.get<AuthConfig>(ConfigKey.auth);
  }

  startSwagger(app: INestApplication) {
    const config = new DocumentBuilder()
      .setTitle('VetClinix')
      .setDescription('Comunity for Veterinarians')
      .setVersion('1.0')
      .addBearerAuth()
      .build();

    const document = SwaggerModule.createDocument(app, config);
    const options: SwaggerCustomOptions = {
      explorer: true,
      customCss: new SwaggerTheme().getBuffer(SwaggerThemeNameEnum.DRACULA),
      customSiteTitle: 'Command System Docs',
    };
    SwaggerModule.setup('api', app, document, options);
  }
}
