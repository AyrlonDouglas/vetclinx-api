export class VoteManager {
  private upvotes: number;
  private downvotes: number;

  constructor(upvotes: number = 0, downvotes: number = 0) {
    this.upvotes = upvotes;
    this.downvotes = downvotes;
  }

  get props(): VoteManagerProps {
    return {
      downvotes: this.downvotes,
      upvotes: this.upvotes,
    };
  }

  upvote() {
    this.upvotes++;
  }

  downvote() {
    this.downvotes++;
  }

  get voteBalance(): number {
    return this.upvotes - this.downvotes;
  }

  get totalVotes() {
    return this.upvotes + this.downvotes;
  }

  voteGrade() {
    if (this.totalVotes === 0) return voteGradeScale.Neutral;

    const result = this.voteBalance / this.totalVotes;

    if (result <= -0.9) return voteGradeScale.ExtremelyNegative;
    if (result <= -0.5) return voteGradeScale.VeryNegative;
    if (result < 0) return voteGradeScale.Negative;
    if (result < 0.5) return voteGradeScale.Positive;
    if (result < 0.9) return voteGradeScale.VeryPositive;

    return voteGradeScale.ExtremelyPositive;
  }
}

type VoteManagerProps = {
  upvotes: number;
  downvotes: number;
};

export const voteGradeScale = {
  ExtremelyNegative: -3,
  VeryNegative: -2,
  Negative: -1,
  Neutral: 0,
  Positive: 1,
  VeryPositive: 2,
  ExtremelyPositive: 3,
} as const;
