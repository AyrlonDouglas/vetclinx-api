import { Module } from '@nestjs/common';
import { UserController } from './controller/user.controller';
import { UserRepository } from '@modules/user/application/repositories/user.repository';
import FakeUserRepository from '@modules/user/infra/repositories/fakeUser.repository';
import CreateUserUseCase from '@modules/user/application/useCases/createUser/createUser.useCase';
import GetUserUseCaseByUsername from '@modules/user/application/useCases/getUserByUsername/getUserByUsername.useCase';
import GetUserByIdUseCase from '@modules/user/application/useCases/getUserById/getUserById.useCase';
import UserUseCases from '@modules/user/application/useCases/user.useCases';

@Module({
  controllers: [UserController],
  providers: [
    { provide: UserRepository, useFactory: () => new FakeUserRepository([]) },
    {
      provide: CreateUserUseCase,
      useFactory: (userRepository: UserRepository) =>
        new CreateUserUseCase(userRepository),
      inject: [UserRepository],
    },
    {
      provide: GetUserUseCaseByUsername,
      useFactory: (userRepository: UserRepository) => {
        return new GetUserUseCaseByUsername(userRepository);
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
      provide: UserUseCases,
      useFactory: (
        getUserUseCase: GetUserUseCaseByUsername,
        createUserUseCase: CreateUserUseCase,
        getUserByIdUseCase: GetUserByIdUseCase,
      ) =>
        new UserUseCases(getUserUseCase, createUserUseCase, getUserByIdUseCase),
      inject: [GetUserUseCaseByUsername, CreateUserUseCase, GetUserByIdUseCase],
    },
  ],
  exports: [],
})
export class UserModule {}
