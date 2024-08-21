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

  get balance(): number {
    return this.upvotes - this.downvotes;
  }

  get totalVotes() {
    return this.upvotes + this.downvotes;
  }

  private wilsonScore(upvotes: number, downvotes: number): number {
    const n = upvotes + downvotes;
    if (n === 0) return 0;
    const z = 1.96; // para 95% de confiança
    const p = upvotes / n;
    const score =
      (p +
        (z * z) / (2 * n) -
        z * Math.sqrt((p * (1 - p) + (z * z) / (4 * n)) / n)) /
      (1 + (z * z) / n);
    return score;
  }

  get grade(): VoteGrade {
    if (this.balance === 0) return voteGradeScale.neutral;

    const moreUpvotes = this.balance > 0;
    const wilsonResult = this.wilsonScore(
      moreUpvotes ? this.upvotes : this.downvotes,
      moreUpvotes ? this.downvotes : this.upvotes,
    );

    const isReliable = wilsonResult >= 0.6;
    const isVeryReliable = wilsonResult >= 0.8;

    if (isReliable) {
      if (moreUpvotes) {
        if (isVeryReliable) return voteGradeScale.veryPositive;
        return voteGradeScale.positive;
      } else {
        return voteGradeScale.negative;
      }
    }

    return voteGradeScale.neutral;
  }
}

export type VoteGrade = (typeof voteGradeScale)[keyof typeof voteGradeScale];

type VoteManagerProps = {
  upvotes: number;
  downvotes: number;
};

export const voteGradeScale = {
  negative: -1,
  neutral: 0,
  positive: 1,
  veryPositive: 2,
} as const;
