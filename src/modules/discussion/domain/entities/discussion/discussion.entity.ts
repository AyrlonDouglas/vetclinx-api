import { Either, left, right } from '@common/core/either';
import Inspetor, { InspetorError } from '@common/core/inspetor';
import { VoteManager, VoteTypes } from '../../component/voteManager.component';
import { DiscussionVote } from '../vote/discussionVote.entity';

export class Discussion {
  private voteManager: VoteManager;
  private constructor(
    private title: string,
    private description: string,
    private authorId: string,
    private createdAt: Date = new Date(),
    private updatedAt: Date = new Date(),
    private commentCount: number = 0,
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
      commentCount: this.commentCount,
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
      input.commentCount,
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

  incrementCommentCount() {
    this.commentCount++;
  }

  decrementCommentCount() {
    this.commentCount = Math.max(0, this.commentCount - 1);
  }

  removeVote(vote: DiscussionVote) {
    this.voteManager.removeVote(vote.props.voteType);
  }

  exchangeVote(from: keyof typeof VoteTypes, to: keyof typeof VoteTypes) {
    this.voteManager.exchangeVote(from, to);
  }
}

export type DiscussionProps = {
  title: string;
  description: string;
  authorId: string;
  createdAt: Date;
  updatedAt: Date;
  commentCount: number;
  upvotes: number;
  downvotes: number;
  resolution?: string;
  id?: string;
};

export type DiscussionCreateInput = Partial<DiscussionProps> &
  Pick<DiscussionProps, 'authorId' | 'description' | 'title'>;
