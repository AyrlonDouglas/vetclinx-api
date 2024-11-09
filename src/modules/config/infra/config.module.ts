import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { configurations } from './config';
import { configProvider } from './config.provider';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: `src/modules/config/envs/.env.${process.env.NODE_ENV}`,
      load: [...configurations],
    }),
  ],
  providers: [configProvider],
  exports: [configProvider],
})
export class ConfigsModule {}
