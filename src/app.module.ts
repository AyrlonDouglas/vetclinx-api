import { Module } from '@nestjs/common';
import { UserModule } from './modules/user/infra/user.module';
import { ConfigsModule } from './modules/config/infra/config.module';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigService } from '@nestjs/config';
import { ConfigKey, DatabaseConfig } from './modules/config/config.interface';
import AuthModule from '@modules/auth/infra/auth.module';
@Module({
  imports: [
    ConfigsModule,
    UserModule,
    AuthModule,
    MongooseModule.forRootAsync({
      imports: [ConfigsModule],
      useFactory: async (configService: ConfigService) => ({
        uri: configService.get<DatabaseConfig>(ConfigKey.db).mongoDB.uri,
      }),
      inject: [ConfigService],
    }),
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
