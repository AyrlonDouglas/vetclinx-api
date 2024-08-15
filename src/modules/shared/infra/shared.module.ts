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
  ],
  exports: [HashService, TokenService, ContextStorageService],
})
export class SharedModule {}
