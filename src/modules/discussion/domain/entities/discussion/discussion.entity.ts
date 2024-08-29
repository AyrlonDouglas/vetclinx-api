import { Either, left, right } from '@common/core/either';
import Inspetor, { InspetorError } from '@common/core/inspetor';
import { VoteManager } from '../../component/voteManager.component';
import { Comment } from '../comment/comment.entity';

export class Discussion {
  private voteManager: VoteManager;
  private constructor(
    private title: string,
    private description: string,
    private authorId: string,
    private createdAt: Date = new Date(),
    private updatedAt: Date = new Date(),
    private comments: Comment[] = [],
    upvotes: number = 0,
    downvotes: number = 0,
    private resolution: string,
    private id?: string,
  ) {
    this.voteManager = new VoteManager(upvotes, downvotes);
  }

  get props(): DiscussionProps {
    return {
      id: this.id,
      title: this.title,
      description: this.description,
      authorId: this.authorId,
      comments: this.comments,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
      downvotes: this.voteManager.props.downvotes,
      upvotes: this.voteManager.props.upvotes,
      resolution: this.resolution,
    };
  }

  static create(
    input: DiscussionCreateInput,
  ): Either<InspetorError, Discussion> {
    const inputOrFail = Inspetor.againstFalsyBulk([
      { argument: input.authorId, argumentName: 'authorId' },
      { argument: input.description, argumentName: 'description' },
      { argument: input.title, argumentName: 'title' },
    ]);

    if (inputOrFail.isLeft()) {
      return left(inputOrFail.value);
    }

    const discussion = new Discussion(
      input.title,
      input.description,
      input.authorId,
      input.createdAt,
      input.updatedAt,
      input.comments,
      input.upvotes,
      input.downvotes,
      input.resolution,
      input.id,
    );

    return right(discussion);
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

  addComment(comment: Comment) {
    this.comments.push(comment);
  }
}

export type DiscussionProps = {
  title: string;
  description: string;
  authorId: string;
  createdAt: Date;
  updatedAt: Date;
  comments: Comment[];
  upvotes: number;
  downvotes: number;
  resolution?: string;
  id?: string;
};

export type DiscussionCreateInput = Partial<DiscussionProps> &
  Pick<DiscussionProps, 'authorId' | 'description' | 'title'>;
