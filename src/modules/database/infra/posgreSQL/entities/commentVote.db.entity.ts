import { Column, Entity, ManyToOne } from 'typeorm';
import { BaseEntity } from './baseEntity.db';
import { VoteTypes } from '@modules/discussion/domain/component/voteManager.component';
import { User } from './user.db.entity';
import { Comment } from './comment.db.entity';

@Entity()
export class CommentVote extends BaseEntity {
  @ManyToOne(() => User, (user) => user.commentVotes)
  user: User;

  @ManyToOne(() => Comment, (comment) => comment.votes)
  comment: Comment;

  @Column({ enum: VoteTypes, type: 'enum' })
  voteType: string;
}
