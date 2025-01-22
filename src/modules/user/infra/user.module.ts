import { Module } from '@nestjs/common';
import { UserController } from './controllers/user.controller';
import { UserRepository } from '@modules/user/application/repositories/user.repository';
import CreateUserUseCase from '@modules/user/application/useCases/createUser/createUser.useCase';
import GetUserByUsernameUseCase from '@modules/user/application/useCases/getUserByUsername/getUserByUsername.useCase';
import GetUserByIdUseCase from '@modules/user/application/useCases/getUserById/getUserById.useCase';
import UserUseCases from '@modules/user/application/useCases/user.useCases';
import RemoveUserByIdUseCase from '../application/useCases/removeUserById/removeUserById.useCase';
import { SharedModule } from '@modules/shared/infra/shared.module';
import PasswordFactory from '../domain/valueObjects/password/password.factory';
import HashService from '@modules/shared/domain/hash.service';
import { DatabaseModule } from '@modules/database/infra/database.module';
import { UserMapper } from './mapper/user.mapper';

@Module({
  controllers: [UserController],
  imports: [SharedModule, DatabaseModule],
  providers: [
    {
      provide: PasswordFactory,
      useFactory: (hashService: HashService) =>
        new PasswordFactory(hashService),
      inject: [HashService],
    },
    {
      provide: UserMapper,
      useFactory: () => new UserMapper(),
    },
    {
      provide: CreateUserUseCase,
      useFactory: (
        userRepository: UserRepository,
        passwordFactory: PasswordFactory,
      ) => new CreateUserUseCase(userRepository, passwordFactory),
      inject: [UserRepository, PasswordFactory],
    },
    {
      provide: GetUserByUsernameUseCase,
      useFactory: (userRepository: UserRepository) => {
        return new GetUserByUsernameUseCase(userRepository);
      },
      inject: [UserRepository],
    },
    {
      provide: GetUserByIdUseCase,
      useFactory: (userRepository: UserRepository) => {
        return new GetUserByIdUseCase(userRepository);
      },
      inject: [UserRepository],
    },
    {
      provide: RemoveUserByIdUseCase,
      useFactory: (userRepository: UserRepository) => {
        return new RemoveUserByIdUseCase(userRepository);
      },
      inject: [UserRepository],
    },
    {
      provide: UserUseCases,
      useFactory: (
        getUserUseCase: GetUserByUsernameUseCase,
        createUserUseCase: CreateUserUseCase,
        getUserByIdUseCase: GetUserByIdUseCase,
        removeUserByIdUseCase: RemoveUserByIdUseCase,
      ) =>
        new UserUseCases(
          getUserUseCase,
          createUserUseCase,
          getUserByIdUseCase,
          removeUserByIdUseCase,
        ),
      inject: [
        GetUserByUsernameUseCase,
        CreateUserUseCase,
        GetUserByIdUseCase,
        RemoveUserByIdUseCase,
      ],
    },
  ],
  exports: [PasswordFactory],
})
export class UserModule {}
