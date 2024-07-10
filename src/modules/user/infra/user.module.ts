import { Module } from '@nestjs/common';
import UserUseCases from '@modules/user/application/useCases/user.useCases';
import GetUserUseCase from '@modules/user/application/useCases/getUser/getUser.useCase';
import { UserRepository } from '@modules/user/application/repositories/user.repository';
import FakeUserRepository from '@modules/user/infra/repositories/fakeUser.repository';
import { UserController } from './controller/user.controller';
import CreateUserUseCase from '../application/useCases/createUser/createUser.useCase';

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
      provide: GetUserUseCase,
      useFactory: (userRepository: UserRepository) => {
        return new GetUserUseCase(userRepository);
      },
      inject: [UserRepository],
    },
    {
      provide: UserUseCases,
      useFactory: (
        getUserUseCase: GetUserUseCase,
        createUserUseCase: CreateUserUseCase,
      ) => new UserUseCases(getUserUseCase, createUserUseCase),
      inject: [GetUserUseCase, CreateUserUseCase],
    },
  ],
  exports: [],
})
export class UserModule {}
