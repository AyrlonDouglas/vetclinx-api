import {
  MiddlewareConsumer,
  Module,
  NestModule,
  RequestMethod,
} from '@nestjs/common';
import { UserModule } from './modules/user/infra/user.module';
import { ConfigsModule } from './modules/config/infra/config.module';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigService } from '@nestjs/config';
import { ConfigKey, DatabaseConfig } from './modules/config/config.interface';
import AuthModule from '@modules/auth/infra/auth.module';
import { SharedModule } from '@modules/shared/infra/shared.module';
import { AuthMiddleware } from '@modules/auth/middleware/auth.middleware';
import { DiscussionModule } from '@modules/discussion/infra/discussion.module';

@Module({
  imports: [
    ConfigsModule,
    UserModule,
    AuthModule,
    DiscussionModule,
    MongooseModule.forRootAsync({
      imports: [ConfigsModule],
      useFactory: async (configService: ConfigService) => ({
        uri: configService.get<DatabaseConfig>(ConfigKey.db).mongoDB.uri,
      }),
      inject: [ConfigService],
    }),
    SharedModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(AuthMiddleware)
      .exclude({ path: '/auth', method: RequestMethod.POST })
      .exclude({ path: '/user', method: RequestMethod.POST }) // remover em prod
      .forRoutes('');
  }
}
