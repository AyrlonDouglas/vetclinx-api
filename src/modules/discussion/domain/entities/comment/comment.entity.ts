import { Either, left, right } from '@common/core/either';
import Inspetor, { InspetorError } from '@common/core/inspetor';
import { VoteManager } from '../../component/voteManager.component';
import User from '@modules/user/domain/entities/user.entity';
import { Discussion } from '../discussion/discussion.entity';

export class Comment {
  private voteManager: VoteManager;

  private constructor(
    private readonly id: string,
    private readonly discussion: string | Discussion,
    private readonly author: string | User,
    private readonly content: string,
    private readonly createdAt: Date = new Date(),
    private readonly updateAt: Date = new Date(),
    upvotes: number = 0,
    downvotes: number = 0,
  ) {
    this.voteManager = new VoteManager(upvotes, downvotes);
  }

  get props(): CommentProps {
    return {
      id: this.id,
      author: this.author,
      discussion: this.discussion,
      content: this.content,
      createdAt: this.createdAt,
      downvotes: this.voteManager.props.downvotes,
      upvotes: this.voteManager.props.upvotes,
      updatedAt: this.updateAt,
    };
  }

  static create(input: CommentCreateInput): Either<InspetorError, Comment> {
    const inputOrFail = Inspetor.againstFalsyBulk([
      { argument: input.author, argumentName: 'author' },
      { argument: input.content, argumentName: 'content' },
      { argument: input.discussion, argumentName: 'discussion' },
    ]);

    if (inputOrFail.isLeft()) {
      return left(inputOrFail.value);
    }

    const comment = new Comment(
      input.id,
      input.discussion,
      input.author,
      input.content,
      input.createdAt,
      input.updatedAt,
      input.upvotes,
      input.downvotes,
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
}

type CommentProps = {
  id?: string;
  discussion: string | Discussion;
  author: string | User;
  content: string;
  upvotes: number;
  downvotes: number;
  createdAt: Date;
  updatedAt: Date;
};

export type CommentCreateInput = Partial<CommentProps> &
  Pick<CommentProps, 'author' | 'content' | 'discussion'>;
