import { DiscussionMapper } from '@modules/discussion/application/mappers/discussion.mapper';
import { CreateDiscussionDTO } from '@modules/discussion/application/useCases/createDiscussion/createDiscussion.dto';
import { DiscussionUseCases } from '@modules/discussion/application/useCases/discussion.useCases';
import { UpdateDiscussionDTO } from '@modules/discussion/application/useCases/updateDiscussion/updateDiscussion.dto';
import { Body, Controller, Get, Param, Patch, Post } from '@nestjs/common';

@Controller('discussion')
export class DiscussionController {
  constructor(
    private readonly discussionUseCases: DiscussionUseCases,
    private readonly discussionMapper: DiscussionMapper,
  ) {}

  @Post()
  async create(@Body() createDiscussionDTO: CreateDiscussionDTO) {
    const result =
      await this.discussionUseCases.createDiscussion.perform(
        createDiscussionDTO,
      );
    if (result.isLeft()) throw result.value;
    return result.value;
  }

  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updateDiscussionDTO: UpdateDiscussionDTO,
  ) {
    const result = await this.discussionUseCases.updateDiscussion.perform({
      ...updateDiscussionDTO,
      id,
    });
    if (result.isLeft()) throw result.value;
    return result.value;
  }

  @Get('/:id')
  async findOneById(@Param('id') id: string) {
    const result = await this.discussionUseCases.getDiscussionById.perform({
      id,
    });
    if (result.isLeft()) throw result.value;
    return this.discussionMapper.toDTO(result.value);
  }

  // @Get()
  // findAll() {
  //   return this.testeService.findAll();
  // }

  // @Get(':id')
  // findOne(@Param('id') id: string) {
  //   return this.testeService.findOne(+id);
  // }

  // @Delete(':id')
  // async remove(@Param('id') id: string) {
  //   const result = await this.userUseCases.removeUserById.perform({ id });
  //   if (result.isLeft()) throw result.value;
  //   return result.value;
  // }
}
