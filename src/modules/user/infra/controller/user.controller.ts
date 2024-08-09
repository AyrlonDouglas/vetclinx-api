import { CreateUserDTO } from '@modules/user/application/useCases/createUser/createUser.dto';
import UserUseCases from '@modules/user/application/useCases/user.useCases';
import { Body, Controller, Delete, Get, Param, Post } from '@nestjs/common';

@Controller('user')
export class UserController {
  constructor(private readonly userUseCases: UserUseCases) {}

  @Post()
  async create(@Body() createUserDTO: CreateUserDTO) {
    return (await this.userUseCases.createUser.perform(createUserDTO)).value;
  }

  // @Get()
  // findAll() {
  //   return this.testeService.findAll();
  // }

  @Get('by-username/:username')
  async findOneByUsername(@Param('username') username: string) {
    return (await this.userUseCases.getUserByUsername.perform({ username }))
      .value;
  }

  @Get('/:id')
  async findOneById(@Param('id') id: string) {
    return (await this.userUseCases.getUserById.perform({ id })).value;
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

  @Delete(':id')
  async remove(@Param('id') id: string) {
    return (await this.userUseCases.removeUserById.perform({ id })).value;
  }
}
