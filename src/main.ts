import { NestFactory } from '@nestjs/core';
import { ConfigService } from '@nestjs/config';
import { AppModule } from './app.module';
import AllExceptionsFilter from '@helpers/filters/httpException.filter';
import { AppConfig, ConfigKey } from './modules/config/config.interface';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const config = app.get(ConfigService);
  const appConfig = config.get<AppConfig>(ConfigKey.app);

  app.useGlobalFilters(new AllExceptionsFilter(config));

  await app.listen(appConfig.port);
}

bootstrap();
