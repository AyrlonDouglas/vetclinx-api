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
import { ApiPresenterInterceptor } from '@common/interceptors/apiPresenter.interceptor';
import { AppController } from './app.controller';

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
  controllers: [AppController],
  providers: [
    {
      provide: APP_INTERCEPTOR,
      useClass: TransactionInterceptor,
    },
    {
      provide: APP_INTERCEPTOR,
      useClass: ApiPresenterInterceptor,
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
      .exclude({ path: '/app/health', method: RequestMethod.GET })
      .forRoutes('');
  }
}
