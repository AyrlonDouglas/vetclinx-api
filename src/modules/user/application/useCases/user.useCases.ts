import CreateUserUseCase from './createUser/createUser.useCase';
import GetUserUseCase from './getUser/getUser.useCase';

export default class UserUseCases {
  constructor(
    private readonly getUserUseCase: GetUserUseCase,
    private readonly createUserUseCase: CreateUserUseCase,
  ) {}

  get createUser() {
    return this.createUserUseCase;
  }

  get getUser() {
    return this.getUserUseCase;
  }
}
