import { CreateDiscussionUseCase } from './createDiscussion/createDiscussion.useCase';
import { UpdateDiscussionUseCase } from './updateDiscussion/updateDiscussion.useCase';

export class DiscussionUseCases {
  constructor(
    private readonly createDiscussionUseCase: CreateDiscussionUseCase,
    private readonly updateDiscussionUseCase: UpdateDiscussionUseCase,
  ) {}

  get createDiscussion() {
    return this.createDiscussionUseCase;
  }

  get updateDiscussion() {
    return this.updateDiscussionUseCase;
  }
}
