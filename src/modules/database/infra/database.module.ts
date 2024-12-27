import { Module } from '@nestjs/common';
import { postgreSQLModule } from './posgreSQL/postgreSQL.module';
import { UserRepository } from '@modules/user/application/repositories/user.repository';
import { UserPostgreRepository } from '@modules/user/infra/repositories/userPostgre.repository';
import { DiscussionRepository } from '@modules/discussion/application/repositories/discussion.repository';
import { DiscussionPostgreRepository } from '@modules/discussion/infra/repositories/discussion/discussionPostgre.repository';
import { CommentRepository } from '@modules/discussion/application/repositories/comment.repository';
import { CommentPostgreRepository } from '@modules/discussion/infra/repositories/comment/commentPostgre.repository';
import { VoteRepository } from '@modules/discussion/application/repositories/vote.repository';
import { VotePostgreRepository } from '@modules/discussion/infra/repositories/vote/votePostgre.repository';

@Module({
  imports: [...postgreSQLModule],

  providers: [
    { provide: UserRepository, useClass: UserPostgreRepository },
    {
      provide: DiscussionRepository,
      useClass: DiscussionPostgreRepository,
    },
    {
      provide: CommentRepository,
      useClass: CommentPostgreRepository,
    },
    { provide: VoteRepository, useClass: VotePostgreRepository },
  ],
  exports: [
    ...postgreSQLModule,
    UserRepository,
    DiscussionRepository,
    CommentRepository,
    VoteRepository,
  ],
})
export class DatabaseModule {}
