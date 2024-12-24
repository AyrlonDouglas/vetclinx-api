import { Column, Entity, ManyToOne, OneToMany } from 'typeorm';
import { BaseEntity } from './baseEntity.db';
import { User } from './user.db.entity';
import { Comment } from './comment.db.entity';
import { DiscussionVote } from './discussionVote.db';

@Entity()
export class Discussion extends BaseEntity {
  @Column()
  description: string;

  @ManyToOne(() => User, (user) => user.discussions)
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
