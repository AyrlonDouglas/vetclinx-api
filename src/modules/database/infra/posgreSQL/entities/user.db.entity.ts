import {
  UserStatus,
  UserType,
} from '@modules/user/domain/entities/user.entity';
import { Entity, Column, BeforeInsert, BeforeUpdate, OneToMany } from 'typeorm';
import { BaseEntity } from './baseEntity.db';
import { CountriesUtil } from '@common/constants/countries';
import { Discussion } from './discussion.db.entity';
import { Comment } from './comment.db.entity';
import { CommentVote } from './commentVote.db.entity';
import { DiscussionVote } from './discussionVote.db';

@Entity()
export class User extends BaseEntity {
  @Column()
  name: string;

  @Column({ unique: true })
  username: string;

  @Column({ unique: true })
  email: string;

  @Column()
  password: string;

  @Column({ default: UserStatus.active, type: 'enum', enum: UserStatus })
  status: keyof typeof UserStatus;

  @Column({ nullable: true })
  phoneNumber?: string;

  @Column()
  birthDate: Date;

  @Column({ type: 'enum', enum: UserType })
  userType: keyof typeof UserType;

  @Column()
  institution: string;

  @Column()
  graduationDate: Date;

  @Column({ nullable: true })
  professionalRegistration?: string;

  @Column()
  country: string;

  @OneToMany(() => Discussion, (discussion) => discussion.author)
  discussions: Discussion[];

  @OneToMany(() => Comment, (comment) => comment.author)
  comments: Comment[];

  @OneToMany(() => DiscussionVote, (discussionVote) => discussionVote.user)
  discussionVotes: DiscussionVote[];

  @OneToMany(() => CommentVote, (commentVote) => commentVote.user)
  commentVotes: CommentVote[];

  @BeforeInsert()
  @BeforeUpdate()
  validateProfessionalRegistration() {
    if (
      this.userType === UserType.veterinarian &&
      !this.professionalRegistration
    ) {
      throw new Error(
        'Professional registration is required for veterinarians.',
      );
    }

    if (!CountriesUtil.getInstance().getNameByAlpha3(this.country)) {
      throw new Error('Country registration is invalid');
    }
  }
}
