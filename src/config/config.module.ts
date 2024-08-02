import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { configurations } from './config';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: `src/config/envs/${process.env.NODE_ENV}.env`,
      load: [...configurations],
    }),
  ],
})
export class ConfigsModule {}
