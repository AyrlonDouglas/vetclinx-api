import { Column, Entity, JoinColumn, ManyToOne, OneToMany } from 'typeorm';
import { BaseEntity } from './baseEntity.db';
import { User } from './user.db.entity';
import { Comment } from './comment.db.entity';
import { DiscussionVote } from './discussionVote.db';
import { VoteGrade } from '@modules/discussion/domain/component/voteManager.component';

@Entity()
export class Discussion extends BaseEntity {
  @Column()
  title: string;

  @Column()
  description: string;

  @Column()
  authorId: number;

  @ManyToOne(() => User, (user) => user.discussions)
  @JoinColumn()
  author: User;

  @Column()
  createdAt: Date;

  @Column()
  updatedAt: Date;

  @Column()
  commentCount: number;

  @Column()
  upvotes: number;

  @Column()
  downvotes: number;

  @Column()
  voteGrade: VoteGrade;

  @Column({ nullable: true })
  resolution?: string;

  @OneToMany(() => Comment, (comment) => comment.discussion)
  comments: Comment[];

  @OneToMany(
    () => DiscussionVote,
    (discussionVote) => discussionVote.discussion,
  )
  votes: DiscussionVote[];
}
