import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { BaseEntity } from './baseEntity.db';
import { User } from './user.db.entity';
import { VoteTypes } from '@modules/discussion/domain/component/voteManager.component';
import { Discussion } from './discussion.db.entity';

@Entity()
export class DiscussionVote extends BaseEntity {
  @Column()
  userId: number;

  @ManyToOne(() => User, (user) => user.discussionVotes)
  @JoinColumn()
  user: User;

  @Column()
  discussionId: number;

  @ManyToOne(() => Discussion, (discussion) => discussion.votes)
  @JoinColumn()
  discussion: Discussion;

  @Column({ enum: VoteTypes, type: 'enum' })
  voteType: keyof typeof VoteTypes;
}
