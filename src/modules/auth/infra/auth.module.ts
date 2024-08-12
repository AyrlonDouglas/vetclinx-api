import { Module } from '@nestjs/common';
import { AuthController } from './controller/auth.controller';
import AuthUseCases from '../application/useCases/auth.useCases';
import SignInUseCase from '../application/useCases/signIn/signIn.useCase';
import AuthenticationService from '../domain/services/authentication/authentication.service';
import { UserRepository } from '@modules/user/application/repositories/user.repository';
import { Config } from '@modules/config/ports/config';
import TokenPort from '../domain/services/token.port';
import { UserModule } from '@modules/user/infra/user.module';
import TokenService from './services/token/token.service';
import { ConfigsModule } from '@modules/config/infra/config.module';

@Module({
  controllers: [AuthController],
  providers: [
    { provide: TokenPort, useClass: TokenService },
    {
      provide: AuthenticationService,
      useFactory: (
        userRepository: UserRepository,
        tokenService: TokenPort,
        config: Config,
      ) => new AuthenticationService(userRepository, tokenService, config),
      inject: [UserRepository, TokenPort, Config],
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
