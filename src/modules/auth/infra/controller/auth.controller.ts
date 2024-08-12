import { Body, Controller, Post } from '@nestjs/common';

@Controller('auth')
export class AuthController {
  // constructor(private readonly userUseCases: UserUseCases) {}

  @Post()
  signIn(@Body() signInDTO: { email: string; password: string }) {
    return signInDTO;
  }
}
