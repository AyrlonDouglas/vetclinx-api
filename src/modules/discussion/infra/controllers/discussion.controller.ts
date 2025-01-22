import { AddCommentDTO } from '@modules/discussion/application/useCases/addComment/addComment.dto';
import { CreateDiscussionDTO } from '@modules/discussion/application/useCases/createDiscussion/createDiscussion.dto';
import { DiscussionUseCases } from '@modules/discussion/application/useCases/discussion.useCases';
import { UpdateDiscussionDTO } from '@modules/discussion/application/useCases/updateDiscussion/updateDiscussion.dto';
import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { UpdateCommentInput } from '@modules/discussion/application/useCases/updateComment/updateComment.dto';
import { VoteTypes } from '@modules/discussion/domain/component/voteManager.component';
import { ApiBearerAuth } from '@nestjs/swagger';
import { ApiPresenter } from '@common/infra/Api.presenter';

@ApiBearerAuth()
@Controller('discussion')
export class DiscussionController {
  constructor(private readonly discussionUseCases: DiscussionUseCases) {}

  @Get('/:id')
  async findOneById(@Param('id') id: string): Promise<ApiPresenter> {
    const result = await this.discussionUseCases.getDiscussionById.perform({
      id,
    });
    if (result.isLeft()) throw result.value;

    return new ApiPresenter({
      message: 'Discussão encontrada com sucesso',
      result: result.value.toPlain(),
    });
  }

  @Post()
  async create(
    @Body() createDiscussionDTO: CreateDiscussionDTO,
  ): Promise<ApiPresenter> {
    const result =
      await this.discussionUseCases.createDiscussion.perform(
        createDiscussionDTO,
      );
    if (result.isLeft()) throw result.value;

    return new ApiPresenter({
      message: 'Discussão criada com sucesso',
      result: result.value,
    });
  }

  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updateDiscussionDTO: UpdateDiscussionDTO,
  ): Promise<ApiPresenter> {
    const result = await this.discussionUseCases.updateDiscussion.perform({
      ...updateDiscussionDTO,
      id,
    });
    if (result.isLeft()) throw result.value;
    return new ApiPresenter({
      message: 'Discussão atualizada com sucesso',
      result: result.value,
    });
  }

  @Post(':id/upvote')
  async upvote(@Param('id') id: string): Promise<ApiPresenter> {
    const result = await this.discussionUseCases.voteOnDiscussion.perform({
      discussionId: id,
      voteType: VoteTypes.up,
    });
    if (result.isLeft()) throw result.value;
    return new ApiPresenter({
      message: 'Discussão votada com sucesso',
      result: result.value,
    });
  }

  @Post(':id/downvote')
  async downvote(@Param('id') id: string): Promise<ApiPresenter> {
    const result = await this.discussionUseCases.voteOnDiscussion.perform({
      discussionId: id,
      voteType: VoteTypes.down,
    });
    if (result.isLeft()) throw result.value;
    return new ApiPresenter({
      message: 'Discussão votada com sucesso',
      result: result.value,
    });
  }

  @Delete(':id')
  async delete(@Param('id') id: string): Promise<ApiPresenter> {
    const result = await this.discussionUseCases.removeDiscussion.perform({
      discussionId: id,
    });
    if (result.isLeft()) {
      throw result.value;
    }
    return new ApiPresenter({
      message: 'Discussão deletada com sucesso',
      result: result.value,
    });
  }

  @Post(':id/comment')
  async addComment(
    @Param('id') id: string,
    @Body() addCommentDTO: AddCommentDTO,
  ): Promise<ApiPresenter> {
    const result = await this.discussionUseCases.addComment.perform({
      ...addCommentDTO,
      discussionId: id,
    });

    if (result.isLeft()) throw result.value;
    return new ApiPresenter({
      message: 'Comentário criado com sucesso',
      result: result.value,
    });
  }
  @Post(':id/comment/:commentId/upvote')
  async upvoteOnComment(
    @Param('commentId') commentId: string,
  ): Promise<ApiPresenter> {
    const result = await this.discussionUseCases.voteOnComment.perform({
      commentId,
      voteType: VoteTypes.up,
    });

    if (result.isLeft()) throw result.value;
    return new ApiPresenter({
      message: 'Comentário votado com sucesso',
      result: result.value,
    });
  }

  @Post(':id/comment/:commentId/downvote')
  async downvoteOnComment(
    @Param('commentId') commentId: string,
  ): Promise<ApiPresenter> {
    const result = await this.discussionUseCases.voteOnComment.perform({
      commentId,
      voteType: VoteTypes.down,
    });

    if (result.isLeft()) throw result.value;
    return new ApiPresenter({
      message: 'Comentário votadp com sucesso',
      result: result.value,
    });
  }

  @Patch(':id/comment/:commentId')
  async updateComment(
    @Param('commentId') commentId: string,
    @Body() updateCommentDTO: UpdateCommentInput,
  ): Promise<ApiPresenter> {
    const result = await this.discussionUseCases.updateComment.perform({
      content: updateCommentDTO.content,
      commentId,
    });

    if (result.isLeft()) throw result.value;
    return new ApiPresenter({
      message: 'Comentário atualizado com sucesso',
      result: result.value,
    });
  }

  @Delete(':id/comment/:commentId')
  async removeComment(
    @Param('id') discussionId: string,
    @Param('commentId') commentId: string,
  ): Promise<ApiPresenter> {
    const result = await this.discussionUseCases.removeComment.perform({
      commentId,
    });

    if (result.isLeft()) throw result.value;
    return new ApiPresenter({
      message: 'Comentário deletado com sucesso',
      result: result.value,
    });
  }
}
