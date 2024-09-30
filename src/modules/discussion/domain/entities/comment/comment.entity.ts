import { Either, left, right } from '@common/core/either';
import Inspetor, { InspetorError } from '@common/core/inspetor';
import { VoteManager } from '../../component/voteManager.component';

export class Comment {
  private voteManager: VoteManager;

  private constructor(
    private readonly id: string,
    private readonly discussionId: string,
    private readonly authorId: string,
    private content: string,
    private readonly createdAt: Date = new Date(),
    private readonly updateAt: Date = new Date(),
    upvotes: number = 0,
    downvotes: number = 0,
    private readonly parentCommentId: string,
    private commentCount: number = 0,
  ) {
    this.voteManager = new VoteManager(upvotes, downvotes);
  }

  get props(): CommentProps {
    return {
      id: this.id,
      discussionId: this.discussionId,
      authorId: this.authorId,
      content: this.content,
      createdAt: this.createdAt,
      downvotes: this.voteManager.props.downvotes,
      upvotes: this.voteManager.props.upvotes,
      updatedAt: this.updateAt,
      parentCommentId: this.parentCommentId,
      commentCount: this.commentCount,
    };
  }

  static create(input: CommentCreateInput): Either<InspetorError, Comment> {
    const inputOrFail = Inspetor.againstFalsyBulk([
      { argument: input.discussionId, argumentName: 'discussionId' },
      { argument: input.content, argumentName: 'content' },
      { argument: input.authorId, argumentName: 'authorId' },
    ]);

    if (inputOrFail.isLeft()) {
      return left(inputOrFail.value);
    }

    const comment = new Comment(
      input.id,
      input.discussionId,
      input.authorId,
      input.content,
      input.createdAt,
      input.updatedAt,
      input.upvotes,
      input.downvotes,
      input.parentCommentId,
      input.commentCount,
    );

    return right(comment);
  }

  upvote() {
    this.voteManager.upvote();
  }

  downvote() {
    this.voteManager.downvote();
  }

  getVoteGrade() {
    return this.voteManager.grade;
  }

  editComment(content: string) {
    this.content = content;
  }

  incrementCommentCount() {
    this.commentCount++;
  }

  decrementCommentCount() {
    this.commentCount = Math.max(0, this.commentCount - 1);
  }
}

type CommentProps = {
  id?: string;
  discussionId: string;
  parentCommentId?: string;
  commentCount: number;
  authorId: string;
  content: string;
  upvotes: number;
  downvotes: number;
  createdAt: Date;
  updatedAt: Date;
};

export type CommentCreateInput = Partial<CommentProps> &
  Pick<CommentProps, 'authorId' | 'content' | 'discussionId'>;
