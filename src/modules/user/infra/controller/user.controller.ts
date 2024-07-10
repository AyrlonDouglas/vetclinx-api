import { CreateUserDTO } from '@modules/user/application/useCases/createUser/createUser.dto';
import UserUseCases from '@modules/user/application/useCases/user.useCases';
import { Body, Controller, Get, Param, Post } from '@nestjs/common';

@Controller('user')
export class UserController {
  constructor(private readonly userUseCases: UserUseCases) {}

  @Post()
  async create(@Body() createUserDTO: CreateUserDTO) {
    const userOrFail =
      await this.userUseCases.createUser.perform(createUserDTO);
    if (userOrFail.isLeft()) {
      throw userOrFail.value;
    }

    return userOrFail.value;
  }

  // @Get()
  // findAll() {
  //   return this.testeService.findAll();
  // }

  @Get(':username')
  async findOne(@Param('username') username: string) {
    return (await this.userUseCases.getUser.perform({ username })).value;
  }

  // @Get()
  // findAll() {
  //   return this.testeService.findAll();
  // }

  // @Get(':id')
  // findOne(@Param('id') id: string) {
  //   return this.testeService.findOne(+id);
  // }

  // @Patch(':id')
  // update(@Param('id') id: string, @Body() updateTesteDto: UpdateTesteDto) {
  //   return this.testeService.update(+id, updateTesteDto);
  // }

  // @Delete(':id')
  // remove(@Param('id') id: string) {
  //   return this.testeService.remove(+id);
  // }
}
