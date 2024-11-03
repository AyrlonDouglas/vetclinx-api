import { CreateUserDTO } from '@modules/user/application/useCases/createUser/createUser.dto';
import UserUseCases from '@modules/user/application/useCases/user.useCases';
import { Body, Controller, Delete, Get, Param, Post } from '@nestjs/common';
import { UserMapper } from '../mapper/user.mapper';

@Controller('user')
export class UserController {
  constructor(
    private readonly userUseCases: UserUseCases,
    private readonly userMapper: UserMapper,
  ) {}

  @Post()
  async create(@Body() createUserDTO: CreateUserDTO) {
    const result = await this.userUseCases.createUser.perform(createUserDTO);
    if (result.isLeft()) throw result.value;
    return result.value;
  }

  @Get('by-username/:username')
  async findOneByUsername(@Param('username') username: string) {
    const result = await this.userUseCases.getUserByUsername.perform({
      username,
    });

    if (result.isLeft()) throw result.value;
    return result.value ? this.userMapper.toDTO(result.value) : null;
  }

  @Get('/:id')
  async findOneById(@Param('id') id: string) {
    const result = await this.userUseCases.getUserById.perform({ id });
    if (result.isLeft()) throw result.value;
    return result.value ? this.userMapper.toDTO(result.value) : null;
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    const result = await this.userUseCases.removeUserById.perform({ id });
    if (result.isLeft()) throw result.value;
    return result.value;
  }

  // @Patch(':id')
  // update(@Param('id') id: string, @Body() updateTesteDto: UpdateTesteDto) {
  //   return this.testeService.update(+id, updateTesteDto);
  // }
}
