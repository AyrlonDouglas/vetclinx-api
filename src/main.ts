import { NestFactory } from '@nestjs/core';
import { ConfigService } from '@nestjs/config';
import { AppModule } from './app.module';
import AllExceptionsFilter from '@helpers/filters/httpException.filter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const config = app.get(ConfigService);
  const PORT = config.get('APP_PORT');

  app.useGlobalFilters(new AllExceptionsFilter());

  await app.listen(PORT);
}

bootstrap();
