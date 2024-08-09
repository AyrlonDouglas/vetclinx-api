import CreateUserUseCase from './createUser/createUser.useCase';
import GetUserByIdUseCase from './getUserById/getUserById.useCase';
import GetUserByUsernameUseCase from './getUserByUsername/getUserByUsername.useCase';
import RemoveUserByIdUserCase from './removeUserById/removeUserById.userCase';

export default class UserUseCases {
  constructor(
    private readonly getUserByUsernameUseCase: GetUserByUsernameUseCase,
    private readonly createUserUseCase: CreateUserUseCase,
    private readonly getUserByIdUserCase: GetUserByIdUseCase,
    private readonly removeUserByIdUserCase: RemoveUserByIdUserCase,
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
