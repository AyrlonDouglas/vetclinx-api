import AuthUseCases from '@modules/auth/application/useCases/auth.useCases';
import { SignInDTO } from '@modules/auth/application/useCases/signIn/signIn.dto';
import { Body, Controller, Post } from '@nestjs/common';

@Controller('auth')
export class AuthController {
  constructor(private readonly authUseCases: AuthUseCases) {}

  @Post()
  async signIn(@Body() signInDTO: SignInDTO) {
    const result = await this.authUseCases.signIn.perform(signInDTO);
    if (result.isLeft()) throw result.value;
    return { token: result.value.token.props.token };
  }
}
