import { AddCommentUseCase } from './addComment/addComment.useCase';
import { CreateDiscussionUseCase } from './createDiscussion/createDiscussion.useCase';
import { GetDiscussionByIdUseCase } from './getDiscussionById/getDiscussionById.useCase';
import { GetDiscussionUseCase } from './getDiscussions/getDiscussions.useCase';
import { RemoveComment } from './removeComment/removeComment.useCase';
import { RemoveDiscussion } from './removeDiscussion/removeDiscussion.useCase';
import { UpdateComment } from './updateComment/updateComment.useCase';
import { UpdateDiscussionUseCase } from './updateDiscussion/updateDiscussion.useCase';
import { VoteOnComment } from './voteOnComment/voteOnComment.useCase';
import { VoteOnDiscussion } from './voteOnDiscussion/voteOnDiscussion.useCase';

export class DiscussionUseCases {
  constructor(
    private readonly createDiscussionUseCase: CreateDiscussionUseCase,
    private readonly updateDiscussionUseCase: UpdateDiscussionUseCase,
    private readonly getDiscussionByIdUsecase: GetDiscussionByIdUseCase,
    private readonly addCommentUseCase: AddCommentUseCase,
    private readonly updateCommentUseCase: UpdateComment,
    private readonly removeCommentUseCase: RemoveComment,
    private readonly removeDiscussionUseCase: RemoveDiscussion,
    private readonly voteOnDiscussionUseCase: VoteOnDiscussion,
    private readonly voteOnCommentUseCase: VoteOnComment,
    private readonly getDiscussionUseCase: GetDiscussionUseCase,
  ) {}
  get createDiscussion() {
    return this.createDiscussionUseCase;
  }

  get updateDiscussion() {
    return this.updateDiscussionUseCase;
  }

  get getDiscussionById() {
    return this.getDiscussionByIdUsecase;
  }

  get addComment() {
    return this.addCommentUseCase;
  }

  get updateComment() {
    return this.updateCommentUseCase;
  }

  get removeComment() {
    return this.removeCommentUseCase;
  }

  get removeDiscussion() {
    return this.removeDiscussionUseCase;
  }

  get voteOnDiscussion() {
    return this.voteOnDiscussionUseCase;
  }

  get voteOnComment() {
    return this.voteOnCommentUseCase;
  }

  get getDiscussions() {
    return this.getDiscussionUseCase;
  }
}
