import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import AllExceptionsFilter from '@helpers/filters/httpException.filter';
import { Config } from '@modules/config/ports/config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const config = app.get(Config);
  const appConfig = config.getAppConfig();

  app.useGlobalFilters(new AllExceptionsFilter(config));
  app.enableCors();
  await app.listen(appConfig.port, () => {
    console.info('🚀 On Fire!!');
  });
}

bootstrap();
