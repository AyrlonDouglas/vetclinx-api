import { Module } from '@nestjs/common';
import { AuthController } from './controller/auth.controller';
import AuthUseCases from '../application/useCases/auth.useCases';
import SignInUseCase from '../application/useCases/signIn/signIn.useCase';
import AuthenticationService from '../domain/services/authentication/authentication.service';
import { UserRepository } from '@modules/user/application/repositories/user.repository';
import { Config } from '@modules/config/ports/config';
import TokenService from '../../shared/domain/token.service';
import { UserModule } from '@modules/user/infra/user.module';
import JWTTokenService from '../../shared/infra/token/jwtToken.service';
import { ConfigsModule } from '@modules/config/infra/config.module';
import { SharedModule } from '@modules/shared/infra/shared.module';
import HashService from '@modules/shared/domain/hash.service';

@Module({
  controllers: [AuthController],
  providers: [
    { provide: TokenService, useClass: JWTTokenService },
    {
      provide: AuthenticationService,
      useFactory: (
        userRepository: UserRepository,
        tokenService: TokenService,
        config: Config,
        hashService: HashService,
      ) =>
        new AuthenticationService(
          userRepository,
          tokenService,
          config,
          hashService,
        ),
      inject: [UserRepository, TokenService, Config, HashService],
    },
    {
      provide: SignInUseCase,
      useFactory: (authenticationService: AuthenticationService) =>
        new SignInUseCase(authenticationService),
      inject: [AuthenticationService],
    },
    {
      provide: AuthUseCases,
      useFactory: (signInUseCase: SignInUseCase) =>
        new AuthUseCases(signInUseCase),
      inject: [SignInUseCase],
    },
  ],
  exports: [],
  imports: [UserModule, ConfigsModule, SharedModule],
})
export default class AuthModule {}
