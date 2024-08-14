import { Module } from '@nestjs/common';
import { AuthController } from './controller/auth.controller';
import AuthUseCases from '../application/useCases/auth.useCases';
import SignInUseCase from '../application/useCases/signIn/signIn.useCase';
import AuthenticationService from '../domain/services/authentication/authentication.service';
import { UserRepository } from '@modules/user/application/repositories/user.repository';
import { Config } from '@modules/config/ports/config';
import TokenService from '../domain/services/token.service';
import { UserModule } from '@modules/user/infra/user.module';
import JWTTokenService from './services/token/token.service';
import { ConfigsModule } from '@modules/config/infra/config.module';

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
      ) => new AuthenticationService(userRepository, tokenService, config),
      inject: [UserRepository, TokenService, Config],
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
  imports: [UserModule, ConfigsModule],
})
export default class AuthModule {}
