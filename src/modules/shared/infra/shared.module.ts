import { Module } from '@nestjs/common';
import HashService from '../domain/hash.service';
import BcryptHashService from './hash/bcrytHash.service';
import JWTTokenService from './token/jwtToken.service';
import TokenService from '../domain/token.service';

@Module({
  providers: [
    { provide: HashService, useClass: BcryptHashService },
    { provide: TokenService, useClass: JWTTokenService },
  ],
  exports: [HashService, TokenService],
})
export class SharedModule {}
