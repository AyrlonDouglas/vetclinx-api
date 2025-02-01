import { Environment } from '@modules/config/config.interface';
import { ConfigsModule } from '@modules/config/infra/config.module';
import { Config } from '@modules/config/ports/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Discussion } from './entities/discussion.db.entity';
import { User } from './entities/user.db.entity';
import { Comment } from './entities/comment.db.entity';
import { SnakeNamingStrategy } from 'typeorm-naming-strategies';
import { CommentVote } from './entities/commentVote.db.entity';
import { DiscussionVote } from './entities/discussionVote.db.entity';
import { Module } from '@nestjs/common';

@Module({
  imports: [
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
          synchronize: false,
          autoLoadEntities: true,
          logging: isDev,
          namingStrategy: new SnakeNamingStrategy(),
          useUTC: true,
          migrationsRun: true,
          migrations: [__dirname + '/migrations/*.{ts,js}'],
        };
      },
      inject: [Config],
    }),
    TypeOrmModule.forFeature([
      User,
      Discussion,
      DiscussionVote,
      Comment,
      CommentVote,
    ]),
  ],
})
export class PostgreSQLModule {}
