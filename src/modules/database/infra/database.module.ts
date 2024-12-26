import { Module } from '@nestjs/common';
import { postgreSQLModule } from './posgreSQL/postgreSQL.module';
import { UserRepository } from '@modules/user/application/repositories/user.repository';
import { UserPostgreRepository } from '@modules/user/infra/repositories/userPostgre.repository';
import { DiscussionRepository } from '@modules/discussion/application/repositories/discussion.repository';
import { DiscussionPostgreRepository } from '@modules/discussion/infra/repositories/discussion/discussionPostgre.repository';
import { CommentRepository } from '@modules/discussion/application/repositories/comment.repository';
import { CommentPostgreRepository } from '@modules/discussion/infra/repositories/comment/commentPostgre.repository';

@Module({
  imports: [...postgreSQLModule],
  exports: [
    ...postgreSQLModule,
    UserRepository,
    DiscussionRepository,
    CommentRepository,
  ],
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
  ],
})
export class DatabaseModule {}
