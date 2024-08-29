import {
  AppConfig,
  ConfigKey,
  DatabaseConfig,
  Environment,
} from '@modules/config/config.interface';
import { ConfigsModule } from '@modules/config/infra/config.module';
import { ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import mongoose from 'mongoose';

export const MongoDBModule = MongooseModule.forRootAsync({
  imports: [ConfigsModule],
  useFactory: async (configService: ConfigService) => ({
    uri: configService.get<DatabaseConfig>(ConfigKey.db).mongoDB.uri,
    connectionFactory: (conn) => {
      const appConfig = configService.get<AppConfig>(ConfigKey.app);
      if (appConfig.env === Environment.dev) {
        mongoose.set('debug', true);
      }

      if (conn.readyState === 1) {
        console.log('✅ MongoDB connected');
      }
      return conn;
    },
  }),
  inject: [ConfigService],
});
