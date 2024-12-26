import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { BaseEntity } from './baseEntity.db';
import { VoteTypes } from '@modules/discussion/domain/component/voteManager.component';
import { User } from './user.db.entity';
import { Comment } from './comment.db.entity';

@Entity()
export class CommentVote extends BaseEntity {
  @Column()
  userId: number;

  @ManyToOne(() => User, (user) => user.commentVotes)
  @JoinColumn()
  user: User;

  @Column()
  commentId: number;

  @ManyToOne(() => Comment, (comment) => comment.votes)
  @JoinColumn()
  comment: Comment;

  @Column({ enum: VoteTypes, type: 'enum' })
  voteType: string;
}
