import { CommentRepository } from '@modules/discussion/application/repositories/comment.repository';
import { DiscussionRepository } from '@modules/discussion/application/repositories/discussion.repository';
import { AddCommentUseCase } from '@modules/discussion/application/useCases/addComment/addComment.useCase';
import { CreateDiscussionUseCase } from '@modules/discussion/application/useCases/createDiscussion/createDiscussion.useCase';
import { GetDiscussionByIdUseCase } from '@modules/discussion/application/useCases/getDiscussionById/getDiscussionById.useCase';
import { UpdateDiscussionUseCase } from '@modules/discussion/application/useCases/updateDiscussion/updateDiscussion.useCase';
import { Discussion } from '@modules/discussion/domain/entities/discussion/discussion.entity';
import { DiscussionFakeRepository } from '@modules/discussion/infra/repositories/discussionFakeRepository';
import { CommentFakeRepository } from '@modules/discussion/infra/repositories/commentFake.repository';
import {
  Context,
  ContextKeysProps,
  ContextStorageService,
} from '@modules/shared/domain/contextStorage.service';
import { TransactionService } from '@modules/shared/domain/transaction.service';
import { FakeTransactionService } from '@modules/shared/infra/transaction/fakeTransaction.service';
// import { MongooseTransactionService } from '@modules/shared/infra/transaction/mongooseTransaction.service';
import User from '@modules/user/domain/entities/user.entity';
import { UserTestSetup } from '@modulesTest/user/test/userTest.setup';
import { AsyncLocalStorage } from 'async_hooks';
import { randomUUID } from 'crypto';
import { RemoveComment } from '@modules/discussion/application/useCases/removeComment/removeComment.useCase';
import { VoteRepository } from '@modules/discussion/application/repositories/vote.repository';
import { VoteFakeRepository } from '@modules/discussion/infra/repositories/voteFake.repository';
import { Comment } from '@modules/discussion/domain/entities/comment/comment.entity';
import { Vote } from '@modules/discussion/domain/entities/vote/vote.entity';
import {
  VoteFor,
  VoteTypes,
} from '@modules/discussion/domain/component/voteManager.component';
import { UpdateComment } from '@modules/discussion/application/useCases/updateComment/updateComment.useCase';
import { RemoveDiscussion } from '@modules/discussion/application/useCases/removeDiscussion/removeDiscussion.useCase';
import { VoteOnComment } from '@modules/discussion/application/useCases/voteOnComment/voteOnComment.useCase';

export class DiscussionTestSetup {
  asyncLocalStorage: AsyncLocalStorage<Context>;
  createDiscussionUseCase: CreateDiscussionUseCase;
  discussionRepository: DiscussionRepository;
  commentRepository: CommentRepository;
  contextStorageService: ContextStorageService;
  transactionService: TransactionService;
  userMock: User;
  updateDiscussionUseCase: UpdateDiscussionUseCase;
  discusssionMock: Discussion;
  getDiscussionByIdUseCase: GetDiscussionByIdUseCase;
  addCommentUseCase: AddCommentUseCase;
  removeCommentUseCase: RemoveComment;
  voteRepository: VoteRepository;
  commentMock: Comment;
  commentWithParentCommentMock: Comment;
  updateCommentUseCase: UpdateComment;
  removeDiscussionUseCase: RemoveDiscussion;
  voteOnCommentUseCase: VoteOnComment;

  constructor() {}

  async prepare() {
    const { userMock } = new UserTestSetup().prepare();
    this.userMock = userMock;

    const store = new Map<
      keyof ContextKeysProps,
      ContextKeysProps[keyof ContextKeysProps]
    >();

    store.set('currentUser', userMock);

    const discusssionMock = Discussion.create({
      description: 'description teste',
      title: 'title test',
      authorId: userMock.props.id,
      id: randomUUID(),
    });

    if (discusssionMock.isLeft()) {
      throw new Error('discusssionMock fail');
    }
    this.discusssionMock = discusssionMock.value;

    this.discussionRepository = new DiscussionFakeRepository([
      discusssionMock.value,
    ]);

    const commentMock = Comment.create({
      authorId: userMock.props.id,
      content: 'some content',
      discussionId: discusssionMock.value.props.id,
      id: '1',
    });

    if (commentMock.isLeft()) {
      throw new Error('commentMock fail');
    }

    const commentWithParentCommentMock = Comment.create({
      authorId: userMock.props.id,
      content: 'some content',
      discussionId: discusssionMock.value.props.id,
      id: '2',
      parentCommentId: commentMock.value.props.id,
    });

    if (commentWithParentCommentMock.isLeft()) {
      throw new Error('commentWithParentCommentMock fail');
    }

    this.commentMock = commentMock.value;
    this.commentWithParentCommentMock = commentWithParentCommentMock.value;

    const voteMock = Vote.create({
      user: userMock.props.id,
      voteFor: VoteFor.comment,
      voteForReferency: commentMock.value.props.id,
      voteType: VoteTypes.up,
      id: '123',
    }).value as Vote;

    this.voteRepository = new VoteFakeRepository([voteMock]);

    this.commentRepository = new CommentFakeRepository([
      this.commentMock,
      this.commentWithParentCommentMock,
    ]);

    this.asyncLocalStorage = {} as AsyncLocalStorage<Context>;
    this.contextStorageService = new ContextStorageService(
      this.asyncLocalStorage,
    );

    this.transactionService = new FakeTransactionService();

    this.createDiscussionUseCase = new CreateDiscussionUseCase(
      this.contextStorageService,
      this.discussionRepository,
    );

    this.updateDiscussionUseCase = new UpdateDiscussionUseCase(
      this.contextStorageService,
      this.discussionRepository,
    );

    this.getDiscussionByIdUseCase = new GetDiscussionByIdUseCase(
      this.discussionRepository,
    );

    this.addCommentUseCase = new AddCommentUseCase(
      this.discussionRepository,
      this.contextStorageService,
      this.commentRepository,
    );

    this.removeCommentUseCase = new RemoveComment(
      this.commentRepository,
      this.contextStorageService,
      this.discussionRepository,
      this.voteRepository,
      this.transactionService,
    );

    this.updateCommentUseCase = new UpdateComment(
      this.commentRepository,
      this.contextStorageService,
    );

    this.removeDiscussionUseCase = new RemoveDiscussion(
      this.discussionRepository,
      this.commentRepository,
      this.contextStorageService,
      this.voteRepository,
      this.transactionService,
    );

    this.voteOnCommentUseCase = new VoteOnComment(
      this.commentRepository,
      this.voteRepository,
      this.contextStorageService,
      this.transactionService,
    );

    return this;
  }
}
