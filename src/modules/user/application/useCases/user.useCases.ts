import CreateUserUseCase from './createUser/createUser.useCase';
import GetUserByIdUseCase from './getUserById/getUserById.useCase';
import GetUserByUsernameUseCase from './getUserByUsername/getUserByUsername.useCase';

export default class UserUseCases {
  constructor(
    private readonly getUserByUsernameUseCase: GetUserByUsernameUseCase,
    private readonly createUserUseCase: CreateUserUseCase,
    private readonly getUserByIdUserCase: GetUserByIdUseCase,
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
}
