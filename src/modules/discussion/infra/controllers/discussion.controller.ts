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
import { DiscussionMapper } from '../mapper/discussion.mapper';
import { UpdateCommentInput } from '@modules/discussion/application/useCases/updateComment/updateComment.dto';
import { VoteTypes } from '@modules/discussion/domain/component/voteManager.component';

@Controller('discussion')
export class DiscussionController {
  constructor(
    private readonly discussionUseCases: DiscussionUseCases,
    private readonly discussionMapper: DiscussionMapper,
  ) {}

  @Get('/:id')
  async findOneById(@Param('id') id: string) {
    const result = await this.discussionUseCases.getDiscussionById.perform({
      id,
    });
    if (result.isLeft()) throw result.value;
    return !result.value ? null : this.discussionMapper.toDTO(result.value);
  }

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

  @Post(':id/upvote')
  async upvote(@Param('id') id: string) {
    const result = await this.discussionUseCases.voteOnDiscussion.perform({
      discussionId: id,
      voteType: VoteTypes.up,
    });
    if (result.isLeft()) throw result.value;
    return result.value;
  }

  @Post(':id/downvote')
  async downvote(@Param('id') id: string) {
    const result = await this.discussionUseCases.voteOnDiscussion.perform({
      discussionId: id,
      voteType: VoteTypes.down,
    });
    if (result.isLeft()) throw result.value;
    return result.value;
  }

  @Delete(':id')
  async delete(@Param('id') id: string) {
    const result = await this.discussionUseCases.removeDiscussion.perform({
      discussionId: id,
    });
    if (result.isLeft()) {
      throw result.value;
    }
    return result.value;
  }

  @Post(':id/comment')
  async addComment(
    @Param('id') id: string,
    @Body() addCommentDTO: AddCommentDTO,
  ) {
    const result = await this.discussionUseCases.addComment.perform({
      ...addCommentDTO,
      discussionId: id,
    });

    if (result.isLeft()) throw result.value;
    return result.value;
  }
  @Post(':id/comment/:commentId/upvote')
  async upvoteOnComment(@Param('commentId') commentId: string) {
    const result = await this.discussionUseCases.voteOnComment.perform({
      commentId,
      voteType: VoteTypes.up,
    });

    if (result.isLeft()) throw result.value;
    return result.value;
  }

  @Post(':id/comment/:commentId/downvote')
  async downvoteOnComment(@Param('commentId') commentId: string) {
    const result = await this.discussionUseCases.voteOnComment.perform({
      commentId,
      voteType: VoteTypes.down,
    });

    if (result.isLeft()) throw result.value;
    return result.value;
  }

  @Patch(':id/comment/:commentId')
  async updateComment(
    @Param('commentId') commentId: string,
    @Body() updateCommentDTO: UpdateCommentInput,
  ) {
    const result = await this.discussionUseCases.updateComment.perform({
      content: updateCommentDTO.content,
      commentId,
    });

    if (result.isLeft()) throw result.value;
    return result.value;
  }

  @Delete(':id/comment/:commentId')
  async removeComment(
    @Param('id') discussionId: string,
    @Param('commentId') commentId: string,
  ) {
    const result = await this.discussionUseCases.removeComment.perform({
      commentId,
    });

    if (result.isLeft()) throw result.value;
    return result.value;
  }
}
