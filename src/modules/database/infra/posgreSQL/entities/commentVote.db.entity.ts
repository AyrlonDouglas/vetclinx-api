import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { BaseEntity } from './baseEntity.db';
import { VoteTypes } from '@modules/discussion/domain/component/voteManager.component';
import { User } from './user.db.entity';
import { Comment } from './comment.db.entity';

@Entity()
export class CommentVote extends BaseEntity {
  @Column()
  authorId: number;

  @ManyToOne(() => User, (user) => user.commentVotes)
  @JoinColumn()
  author: User;

  @Column()
  commentId: number;

  @ManyToOne(() => Comment, (comment) => comment.votes)
  @JoinColumn()
  comment: Comment;

  @Column({ enum: VoteTypes, type: 'enum' })
  voteType: keyof typeof VoteTypes;
}
