import { AddCommentUseCase } from './addComment/addComment.useCase';
import { CreateDiscussionUseCase } from './createDiscussion/createDiscussion.useCase';
import { GetDiscussionByIdUseCase } from './getDiscussionById/getDiscussionById.useCase';
import { UpdateDiscussionUseCase } from './updateDiscussion/updateDiscussion.useCase';

export class DiscussionUseCases {
  constructor(
    private readonly createDiscussionUseCase: CreateDiscussionUseCase,
    private readonly updateDiscussionUseCase: UpdateDiscussionUseCase,
    private readonly getDiscussionByIdUsecase: GetDiscussionByIdUseCase,
    private readonly addCommentUseCase: AddCommentUseCase,
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
}
