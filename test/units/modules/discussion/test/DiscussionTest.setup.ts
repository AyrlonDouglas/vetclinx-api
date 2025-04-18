import { CommentRepository } from '@modules/discussion/application/repositories/comment.repository';
import { DiscussionRepository } from '@modules/discussion/application/repositories/discussion.repository';
import { AddCommentUseCase } from '@modules/discussion/application/useCases/addComment/addComment.useCase';
import { CreateDiscussionUseCase } from '@modules/discussion/application/useCases/createDiscussion/createDiscussion.useCase';
import { GetDiscussionByIdUseCase } from '@modules/discussion/application/useCases/getDiscussionById/getDiscussionById.useCase';
import { UpdateDiscussionUseCase } from '@modules/discussion/application/useCases/updateDiscussion/updateDiscussion.useCase';
import { Discussion } from '@modules/discussion/domain/entities/discussion/discussion.entity';
import { DiscussionFakeRepository } from '@modules/discussion/infra/repositories/discussion/discussionFakeRepository';
import { CommentFakeRepository } from '@modules/discussion/infra/repositories/comment/commentFake.repository';
import {
  Context,
  ContextStorageService,
} from '@modules/shared/domain/contextStorage.service';
import { TransactionService } from '@modules/shared/domain/transaction.service';
import { FakeTransactionService } from '@modules/shared/infra/transaction/fakeTransaction.service';
import User from '@modules/user/domain/entities/user.entity';
import { UserTestSetup } from '@modulesTest/user/test/userTest.setup';
import { AsyncLocalStorage } from 'async_hooks';
import { randomUUID } from 'crypto';
import { RemoveComment } from '@modules/discussion/application/useCases/removeComment/removeComment.useCase';
import { Comment } from '@modules/discussion/domain/entities/comment/comment.entity';
import { VoteTypes } from '@modules/discussion/domain/component/voteManager.component';
import { UpdateComment } from '@modules/discussion/application/useCases/updateComment/updateComment.useCase';
import { RemoveDiscussion } from '@modules/discussion/application/useCases/removeDiscussion/removeDiscussion.useCase';
import { VoteOnComment } from '@modules/discussion/application/useCases/voteOnComment/voteOnComment.useCase';
import { VoteOnDiscussion } from '@modules/discussion/application/useCases/voteOnDiscussion/voteOnDiscussion.useCase';
import { DiscussionUseCases } from '@modules/discussion/application/useCases/discussion.useCases';
import { CommentVoteRepository } from '@modules/discussion/application/repositories/commentVote.repository';
import { DiscussionVoteRepository } from '@modules/discussion/application/repositories/discussionVote.repository';
import { CommentVote } from '@modules/discussion/domain/entities/vote/commentVote.entity';
import { DiscussionVote } from '@modules/discussion/domain/entities/vote/discussionVote.entity';
import { CommentVoteFakeRepository } from '@modules/discussion/infra/repositories/commentVote/commentVoteFake.repository';
import { DiscussionVoteFakeRepository } from '@modules/discussion/infra/repositories/discussionVote/discussionVoteFake.repository';
import { GetDiscussionsUseCase } from '@modules/discussion/application/useCases/getDiscussions/getDiscussions.useCase';

export class DiscussionTestSetup {
  asyncLocalStorage: AsyncLocalStorage<Context>;
  createDiscussionUseCase: CreateDiscussionUseCase;
  discussionRepository: DiscussionRepository;
  commentRepository: CommentRepository;
  contextStorageService: ContextStorageService;
  transactionService: TransactionService;
  userMock: User;
  userMock2: User;
  updateDiscussionUseCase: UpdateDiscussionUseCase;
  discusssionMock: Discussion;
  getDiscussionByIdUseCase: GetDiscussionByIdUseCase;
  addCommentUseCase: AddCommentUseCase;
  removeCommentUseCase: RemoveComment;
  commentVoteRepository: CommentVoteRepository;
  discussionVoteRepository: DiscussionVoteRepository;
  commentMock: Comment;
  commentWithParentCommentMock: Comment;
  updateCommentUseCase: UpdateComment;
  removeDiscussionUseCase: RemoveDiscussion;
  voteOnCommentUseCase: VoteOnComment;
  voteOnDiscussionUseCase: VoteOnDiscussion;
  getDiscussionUserCase: GetDiscussionsUseCase;
  discussionUseCases: DiscussionUseCases;

  constructor() {}

  async prepare() {
    const { userMock, userMock2 } = new UserTestSetup().prepare();
    this.userMock = userMock;
    this.userMock2 = userMock2;

    const store = new Context();

    store.set('currentUser', userMock);

    const discusssionMock = Discussion.create({
      description: 'description teste',
      title: 'title test',
      authorId: userMock.props.id,
      id: randomUUID(),
      upvotes: 1,
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
      upvotes: 1,
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

    const commentVoteMock = CommentVote.create({
      authorId: userMock2.props.id,
      commentId: commentMock.value.props.id,
      voteType: VoteTypes.up,
      id: '123',
    }).value as CommentVote;

    const discussionVoteMock = DiscussionVote.create({
      authorId: userMock2.props.id,
      discussionId: discusssionMock.value.props.id,
      voteType: VoteTypes.up,
      id: '123',
    }).value as DiscussionVote;

    this.commentVoteRepository = new CommentVoteFakeRepository([
      commentVoteMock,
    ]);

    this.discussionVoteRepository = new DiscussionVoteFakeRepository([
      discussionVoteMock,
    ]);

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
      this.transactionService,
    );

    this.removeCommentUseCase = new RemoveComment(
      this.commentRepository,
      this.contextStorageService,
      this.discussionRepository,
      this.commentVoteRepository,
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
      this.transactionService,
      this.commentVoteRepository,
      this.discussionVoteRepository,
    );

    this.voteOnCommentUseCase = new VoteOnComment(
      this.commentRepository,
      this.commentVoteRepository,
      this.contextStorageService,
      this.transactionService,
    );

    this.voteOnDiscussionUseCase = new VoteOnDiscussion(
      this.discussionRepository,
      this.contextStorageService,
      this.discussionVoteRepository,
      this.transactionService,
    );

    this.getDiscussionUserCase = new GetDiscussionsUseCase(
      this.discussionRepository,
    );

    this.discussionUseCases = new DiscussionUseCases(
      this.createDiscussionUseCase,
      this.updateDiscussionUseCase,
      this.getDiscussionByIdUseCase,
      this.addCommentUseCase,
      this.updateCommentUseCase,
      this.removeCommentUseCase,
      this.removeDiscussionUseCase,
      this.voteOnDiscussionUseCase,
      this.voteOnCommentUseCase,
      this.getDiscussionUserCase,
    );

    return this;
  }
}
