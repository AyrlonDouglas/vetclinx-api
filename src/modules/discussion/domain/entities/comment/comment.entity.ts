import { Either, left, right } from '@common/core/either';
import Inspetor, { InspetorError } from '@common/core/inspetor';
import { VoteManager } from '../../component/voteManager.component';

export class Comment {
  private voteManager: VoteManager;

  private constructor(
    private readonly id: string,
    private readonly discussionId: string,
    private readonly authorId: string,
    private readonly content: string,
    private readonly createdAt: Date = new Date(),
    upvotes: number = 0,
    downvotes: number = 0,
  ) {
    this.voteManager = new VoteManager(upvotes, downvotes);
  }

  get props(): CommentProps {
    return {
      id: this.id,
      authorId: this.authorId,
      discussionId: this.discussionId,
      content: this.content,
      createdAt: this.createdAt,
      downvotes: this.voteManager.props.downvotes,
      upvotes: this.voteManager.props.upvotes,
    };
  }

  static create(input: CommentCreateInput): Either<InspetorError, Comment> {
    const inputOrFail = Inspetor.againstFalsyBulk([
      { argument: input.authorId, argumentName: 'authorId' },
      { argument: input.content, argumentName: 'content' },
      { argument: input.discussionId, argumentName: 'discussionId' },
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
}

type CommentProps = {
  id?: string;
  discussionId: string;
  authorId: string;
  content: string;
  createdAt: Date;
  upvotes: number;
  downvotes: number;
};

export type CommentCreateInput = Partial<CommentProps> &
  Pick<CommentProps, 'authorId' | 'content' | 'discussionId'>;
