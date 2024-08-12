import { Module } from '@nestjs/common';
import { UserController } from './controller/user.controller';
import { UserRepository } from '@modules/user/application/repositories/user.repository';
import CreateUserUseCase from '@modules/user/application/useCases/createUser/createUser.useCase';
import GetUserByUsernameUseCase from '@modules/user/application/useCases/getUserByUsername/getUserByUsername.useCase';
import GetUserByIdUseCase from '@modules/user/application/useCases/getUserById/getUserById.useCase';
import UserUseCases from '@modules/user/application/useCases/user.useCases';
import { MongooseModule } from '@nestjs/mongoose';
import { UserModel, UserSchema } from './schemas/user.schema';
import UserMongooseRepository from './repositories/UserMongoose.repository';
import RemoveUserByIdUseCase from '../application/useCases/removeUserById/removeUserById.userCase';

@Module({
  controllers: [UserController],
  imports: [
    MongooseModule.forFeature([{ name: UserModel.name, schema: UserSchema }]),
  ],
  providers: [
    UserMongooseRepository,
    { provide: UserRepository, useClass: UserMongooseRepository },
    {
      provide: CreateUserUseCase,
      useFactory: (userRepository: UserRepository) =>
        new CreateUserUseCase(userRepository),
      inject: [UserRepository],
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
  exports: [UserRepository],
})
export class UserModule {}
