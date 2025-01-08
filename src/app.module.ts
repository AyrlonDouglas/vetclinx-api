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
import { DiscussionModule } from '@modules/discussion/infra/discussion.module';
import { DatabaseModule } from '@modules/database/infra/database.module';
import { APP_GUARD, APP_INTERCEPTOR } from '@nestjs/core';
import { TransactionInterceptor } from '@common/interceptors/transaction.interceptor';
import { InitContextStoreMiddleware } from '@common/middleware/initContextStore.middleware';
import { AuthMiddleware } from '@common/middleware/auth.middleware';
import { QueryRunnerMiddleware } from '@common/middleware/queryRunner.midleware';
import { SecurityModule } from '@modules/security/infra/security.module';
import { ThrottlerGuard } from '@nestjs/throttler';

@Module({
  imports: [
    ConfigsModule,
    UserModule,
    AuthModule,
    DiscussionModule,
    SharedModule,
    DatabaseModule,
    SecurityModule,
  ],
  controllers: [],
  providers: [
    {
      provide: APP_INTERCEPTOR,
      useClass: TransactionInterceptor,
    },

    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(InitContextStoreMiddleware).forRoutes('');
    consumer.apply(QueryRunnerMiddleware).forRoutes('');
    consumer
      .apply(AuthMiddleware)
      .exclude({ path: '/auth', method: RequestMethod.POST })
      .exclude({ path: '/user', method: RequestMethod.POST })
      .forRoutes('');
  }
}
