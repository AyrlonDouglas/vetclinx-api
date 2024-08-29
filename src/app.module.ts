import {
  MiddlewareConsumer,
  Module,
  NestModule,
  RequestMethod,
} from '@nestjs/common';
import { UserModule } from './modules/user/infra/user.module';
import { ConfigsModule } from './modules/config/infra/config.module';
import AuthModule from '@modules/auth/infra/auth.module';
import { SharedModule } from '@modules/shared/infra/shared.module';
import { AuthMiddleware } from '@modules/auth/middleware/auth.middleware';
import { DiscussionModule } from '@modules/discussion/infra/discussion.module';
import { DatabaseModule } from '@modules/database/infra/database.module';

@Module({
  imports: [
    ConfigsModule,
    UserModule,
    AuthModule,
    DiscussionModule,
    SharedModule,
    DatabaseModule,
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
