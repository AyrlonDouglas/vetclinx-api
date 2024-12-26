import { Column, Entity, JoinColumn, ManyToOne, OneToMany } from 'typeorm';
import { BaseEntity } from './baseEntity.db';
import { Discussion } from './discussion.db.entity';
import { User } from './user.db.entity';
import { CommentVote } from './commentVote.db.entity';

@Entity()
export class Comment extends BaseEntity {
  @Column()
  discussionId: number;

  @ManyToOne(() => Discussion, (discussion) => discussion.comments)
  @JoinColumn()
  discussion: Discussion;

  @Column({ nullable: true })
  parentCommentId?: number;

  @ManyToOne(() => Comment, (comment) => comment.parentComment)
  @JoinColumn()
  parentComment?: Comment;

  @OneToMany(() => Comment, (comment) => comment.childComments)
  childComments: Comment[];

  @Column()
  commentCount: number;

  @Column()
  authorId: number;

  @ManyToOne(() => User, (user) => user.comments)
  @JoinColumn()
  author: User;

  @Column()
  content: string;

  @Column()
  upvotes: number;

  @Column()
  downvotes: number;

  @OneToMany(() => CommentVote, (commentVote) => commentVote.comment)
  votes?: CommentVote[];
}
