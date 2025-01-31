import { Module } from '@nestjs/common';
import { PostgreSQLModule } from './postgreSQL/postgreSQL.module';
import { UserRepository } from '@modules/user/application/repositories/user.repository';
import { UserPostgreRepository } from '@modules/user/infra/repositories/userPostgre.repository';
import { DiscussionRepository } from '@modules/discussion/application/repositories/discussion.repository';
import { DiscussionPostgreRepository } from '@modules/discussion/infra/repositories/discussion/discussionPostgre.repository';
import { CommentRepository } from '@modules/discussion/application/repositories/comment.repository';
import { CommentPostgreRepository } from '@modules/discussion/infra/repositories/comment/commentPostgre.repository';
import { DiscussionVoteRepository } from '@modules/discussion/application/repositories/discussionVote.repository';
import { DiscussionVotePostgreRepository } from '@modules/discussion/infra/repositories/discussionVote/discussionVotePostgre.repository';
import { CommentVoteRepository } from '@modules/discussion/application/repositories/commentVote.repository';
import { CommentVotePostgreRepository } from '@modules/discussion/infra/repositories/commentVote/commentVotePostgre.repository';

@Module({
  imports: [PostgreSQLModule],

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
    {
      provide: DiscussionVoteRepository,
      useClass: DiscussionVotePostgreRepository,
    },
    {
      provide: CommentVoteRepository,
      useClass: CommentVotePostgreRepository,
    },
  ],
  exports: [
    PostgreSQLModule,
    UserRepository,
    DiscussionRepository,
    CommentRepository,
    DiscussionVoteRepository,
    CommentVoteRepository,
  ],
})
export class DatabaseModule {}
