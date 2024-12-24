import { Environment } from '@modules/config/config.interface';
import { ConfigsModule } from '@modules/config/infra/config.module';
import { Config } from '@modules/config/ports/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Discussion } from './entities/discussion.db.entity';
import { User } from './entities/user.db.entity';
import { Comment } from './entities/comment.db.entity';
import { SnakeNamingStrategy } from 'typeorm-naming-strategies';
import { CommentVote } from './entities/commentVote.db.entity';
import { DiscussionVote } from './entities/discussionVote.db';

export const postgreSQLModule = [
  TypeOrmModule.forRootAsync({
    imports: [ConfigsModule],
    useFactory: (configService: Config) => {
      const appConfig = configService.getAppConfig();
      const dbConfig = configService.getDatabaseConfig();
      const isDev = appConfig.env === Environment.dev;

      return {
        type: 'postgres',
        host: dbConfig.postgreSQL.host,
        port: +dbConfig.postgreSQL.port,
        username: dbConfig.postgreSQL.username,
        password: dbConfig.postgreSQL.password,
        database: dbConfig.postgreSQL.database,
        synchronize: true,
        autoLoadEntities: true,
        logging: isDev,
        namingStrategy: new SnakeNamingStrategy(),
        useUTC: true,
      };
    },
    inject: [Config],
  }),
  TypeOrmModule.forFeature([User]),
  TypeOrmModule.forFeature([Discussion]),
  TypeOrmModule.forFeature([DiscussionVote]),
  TypeOrmModule.forFeature([Comment]),
  TypeOrmModule.forFeature([CommentVote]),
];
