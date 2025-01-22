import SignInUseCase from './signIn/signIn.useCase';

export default class AuthUseCases {
  constructor(private readonly signInUseCase: SignInUseCase) {}

  get signIn() {
    return this.signInUseCase;
  }
}
