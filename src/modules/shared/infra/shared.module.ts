import { Global, Module } from '@nestjs/common';
import HashService from '../domain/hash.service';
import BcryptHashService from './hash/bcrytHash.service';
import JWTTokenService from './token/jwtToken.service';
import TokenService from '../domain/token.service';
import {
  Context,
  ContextStorageService,
} from '../domain/contextStorage.service';
import { AsyncLocalStorage } from 'async_hooks';
import { TransactionService } from '../domain/transaction.service';
import { DatabaseModule } from '@modules/database/infra/database.module';
import { PostgreTransactionService } from './transaction/postgreTransaction.service';
import { PresenterService } from '../domain/presenter.service';

@Global()
@Module({
  providers: [
    { provide: HashService, useClass: BcryptHashService },
    { provide: TokenService, useClass: JWTTokenService },
    { provide: AsyncLocalStorage, useClass: AsyncLocalStorage },
    {
      provide: ContextStorageService,
      useFactory: (asyncLocalStorage: AsyncLocalStorage<Context>) =>
        new ContextStorageService(asyncLocalStorage),
      inject: [AsyncLocalStorage],
    },
    PostgreTransactionService,
    {
      provide: TransactionService,
      useClass: PostgreTransactionService,
    },
    PresenterService,
  ],
  exports: [
    HashService,
    TokenService,
    ContextStorageService,
    TransactionService,
    PresenterService,
  ],
  imports: [DatabaseModule],
})
export class SharedModule {}
