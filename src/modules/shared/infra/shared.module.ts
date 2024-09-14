import { Module } from '@nestjs/common';
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
import { MongooseTransactionService } from './transaction/mongooseTransaction.service';
import { DatabaseModule } from '@modules/database/infra/database.module';

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
    MongooseTransactionService,
    {
      provide: TransactionService,
      useClass: MongooseTransactionService,
    },
  ],
  exports: [
    HashService,
    TokenService,
    ContextStorageService,
    TransactionService,
  ],
  imports: [DatabaseModule],
})
export class SharedModule {}
