import { AddCommentUseCase } from '@modules/discussion/application/useCases/addComment/addComment.useCase';
import { DiscussionTestSetup } from '../test/DiscussionTest.setup';
import { CreateDiscussionUseCase } from '@modules/discussion/application/useCases/createDiscussion/createDiscussion.useCase';
import { GetDiscussionByIdUseCase } from '@modules/discussion/application/useCases/getDiscussionById/getDiscussionById.useCase';
import { RemoveComment } from '@modules/discussion/application/useCases/removeComment/removeComment.useCase';
import { RemoveDiscussion } from '@modules/discussion/application/useCases/removeDiscussion/removeDiscussion.useCase';
import { UpdateComment } from '@modules/discussion/application/useCases/updateComment/updateComment.useCase';
import { VoteOnComment } from '@modules/discussion/application/useCases/voteOnComment/voteOnComment.useCase';
import { UpdateDiscussionUseCase } from '@modules/discussion/application/useCases/updateDiscussion/updateDiscussion.useCase';
import { VoteOnDiscussion } from '@modules/discussion/application/useCases/voteOnDiscussion/voteOnDiscussion.useCase';

describe('DiscussionUseCases', () => {
  const makeSut = async () => {
    const { discussionUseCases } = await new DiscussionTestSetup().prepare();

    return { sut: discussionUseCases };
  };

  test('Should return AddCommentUseCase instance', async () => {
    const { sut } = await makeSut();

    const result = sut.addComment;

    expect(result).toBeInstanceOf(AddCommentUseCase);
    expect(result.perform).toBeDefined();
  });

  test('Should return CreateDiscussionUseCase instance', async () => {
    const { sut } = await makeSut();

    const result = sut.createDiscussion;

    expect(result).toBeInstanceOf(CreateDiscussionUseCase);
    expect(result.perform).toBeDefined();
  });

  test('Should return GetDiscussionByIdUseCase instance', async () => {
    const { sut } = await makeSut();

    const result = sut.getDiscussionById;

    expect(result).toBeInstanceOf(GetDiscussionByIdUseCase);
    expect(result.perform).toBeDefined();
  });

  test('Should return RemoveComment instance', async () => {
    const { sut } = await makeSut();

    const result = sut.removeComment;

    expect(result).toBeInstanceOf(RemoveComment);
    expect(result.perform).toBeDefined();
  });

  test('Should return RemoveDiscussion instance', async () => {
    const { sut } = await makeSut();

    const result = sut.removeDiscussion;

    expect(result).toBeInstanceOf(RemoveDiscussion);
    expect(result.perform).toBeDefined();
  });

  test('Should return UpdateComment instance', async () => {
    const { sut } = await makeSut();

    const result = sut.updateComment;

    expect(result).toBeInstanceOf(UpdateComment);
    expect(result.perform).toBeDefined();
  });

  test('Should return UpdateDiscussionUseCase instance', async () => {
    const { sut } = await makeSut();

    const result = sut.updateDiscussion;

    expect(result).toBeInstanceOf(UpdateDiscussionUseCase);
    expect(result.perform).toBeDefined();
  });

  test('Should return VoteOnComment instance', async () => {
    const { sut } = await makeSut();

    const result = sut.voteOnComment;

    expect(result).toBeInstanceOf(VoteOnComment);
    expect(result.perform).toBeDefined();
  });

  test('Should return VoteOnDiscussion instance', async () => {
    const { sut } = await makeSut();

    const result = sut.voteOnDiscussion;

    expect(result).toBeInstanceOf(VoteOnDiscussion);
    expect(result.perform).toBeDefined();
  });
});
