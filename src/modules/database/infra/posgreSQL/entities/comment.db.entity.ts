import { Column, Entity, ManyToOne, OneToMany } from 'typeorm';
import { BaseEntity } from './baseEntity.db';
import { Discussion } from './discussion.db.entity';
import { User } from './user.db.entity';
import { CommentVote } from './commentVote.db.entity';

@Entity()
export class Comment extends BaseEntity {
  @ManyToOne(() => Discussion, (discussion) => discussion.comments)
  discussion: Discussion;

  @ManyToOne(() => Comment, (comment) => comment.parentComments, {
    nullable: true,
  })
  parentComments?: Comment[];

  @Column()
  commentCount: number;

  @ManyToOne(() => User, (user) => user.comments)
  author: User;

  @Column()
  content: string;

  @Column()
  upvotes: number;

  @Column()
  downvotes: number;

  @OneToMany(() => CommentVote, (commentVote) => commentVote.comment)
  votes: CommentVote[];
}
