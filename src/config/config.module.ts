import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

// ConfigModule.forRoot({ isGlobal: true, load: [DevelopmentConfig] }),

@Module({
  imports: [ConfigModule.forRoot({ isGlobal: true })],
})
export class ConfigsModule {}
