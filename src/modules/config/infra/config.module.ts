import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { configurations } from './config';
import { configProvider } from './config.provider';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: `src/modules/config/envs/${process.env.NODE_ENV}.env`,
      load: [...configurations],
    }),
  ],
  providers: [configProvider],
  exports: [configProvider],
})
export class ConfigsModule {}
