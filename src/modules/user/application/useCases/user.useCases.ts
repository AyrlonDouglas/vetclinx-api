import CreateUserUseCase from './createUser/createUser.useCase';
import GetUserByIdUseCase from './getUserById/getUserById.useCase';
import GetUserByUsernameUseCase from './getUserByUsername/getUserByUsername.useCase';
import RemoveUserByIdUseCase from './removeUserById/removeUserById.useCase';

export default class UserUseCases {
  constructor(
    private readonly getUserByUsernameUseCase: GetUserByUsernameUseCase,
    private readonly createUserUseCase: CreateUserUseCase,
    private readonly getUserByIdUserCase: GetUserByIdUseCase,
    private readonly removeUserByIdUserCase: RemoveUserByIdUseCase,
  ) {}

  get createUser() {
    return this.createUserUseCase;
  }

  get getUserByUsername() {
    return this.getUserByUsernameUseCase;
  }

  get getUserById() {
    return this.getUserByIdUserCase;
  }

  get removeUserById() {
    return this.removeUserByIdUserCase;
  }
}
