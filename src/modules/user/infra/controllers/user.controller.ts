import { CreateUserDTO } from '@modules/user/application/useCases/createUser/createUser.dto';
import UserUseCases from '@modules/user/application/useCases/user.useCases';
import { Body, Controller, Delete, Get, Param, Post } from '@nestjs/common';
import { ContextStorageService } from '@modules/shared/domain/contextStorage.service';
import { ApiBearerAuth } from '@nestjs/swagger';
import { ApiPresenter } from '@common/infra/Api.presenter';
import { PresenterService } from '@modules/shared/domain/presenter.service';

@ApiBearerAuth()
@Controller('user')
export class UserController {
  constructor(
    private readonly userUseCases: UserUseCases,
    private readonly context: ContextStorageService,
    private readonly presenterService: PresenterService,
  ) {}

  @Post()
  async create(@Body() createUserDTO: CreateUserDTO): Promise<ApiPresenter> {
    const result = await this.userUseCases.createUser.perform(createUserDTO);

    if (result.isLeft()) throw result.value;

    return this.presenterService.present({
      message: 'Usuário criado com sucesso.',
      result: result.value,
    });
  }

  @Get('username/:username')
  async findOneByUsername(
    @Param('username') username: string,
  ): Promise<ApiPresenter> {
    const result = await this.userUseCases.getUserByUsername.perform({
      username,
    });

    if (result.isLeft()) throw result.value;

    return this.presenterService.present({
      message: 'Usuário encontrado com sucesso.',
      result: result.value?.toPlain(),
    });
  }

  @Get('/me')
  async findOneByMe(): Promise<ApiPresenter> {
    const user = this.context.get('currentUser');
    const result = await this.userUseCases.getUserById.perform({
      id: user.props.id,
    });

    if (result.isLeft()) throw result.value;

    return this.presenterService.present({
      message: 'Usuário encontrado com sucesso',
      result: result.value?.toPlain(),
    });
  }

  @Get('/:id')
  async findOneById(@Param('id') id: string): Promise<ApiPresenter> {
    const result = await this.userUseCases.getUserById.perform({ id });

    if (result.isLeft()) throw result.value;

    return this.presenterService.present({
      message: 'Usuário encontrado com sucesso',
      result: result.value?.toPlain(),
    });
  }

  @Delete(':id')
  async remove(@Param('id') id: string): Promise<ApiPresenter> {
    const result = await this.userUseCases.removeUserById.perform({ id });

    if (result.isLeft()) throw result.value;

    return this.presenterService.present({
      message: 'Usuário Deletado com sucesso',
      result: result.value,
    });
  }

  // @Patch(':id')
  // update(@Param('id') id: string, @Body() updateTesteDto: UpdateTesteDto) {
  //   return this.testeService.update(+id, updateTesteDto);
  // }
}
