import { Column, Entity, ManyToOne } from 'typeorm';
import { BaseEntity } from './baseEntity.db';
import { User } from './user.db.entity';
import { VoteTypes } from '@modules/discussion/domain/component/voteManager.component';
import { Discussion } from './discussion.db.entity';

@Entity()
export class DiscussionVote extends BaseEntity {
  @ManyToOne(() => User, (user) => user.discussionVotes)
  user: User;

  @ManyToOne(() => Discussion, (discussion) => discussion.votes)
  discussion: Discussion;

  @Column({ enum: VoteTypes, type: 'enum' })
  voteType: string;
}
