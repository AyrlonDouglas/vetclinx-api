import {
  AppConfig,
  ConfigKey,
  DatabaseConfig,
  Environment,
} from '@modules/config/config.interface';
import { ConfigsModule } from '@modules/config/infra/config.module';
import {
  CommentModel,
  CommentSchema,
} from '@modules/discussion/infra/schemas/comment.schema';
import {
  DiscussionModel,
  DiscussionSchema,
} from '@modules/discussion/infra/schemas/discussion.schema';
import { UserModel, UserSchema } from '@modules/user/infra/schemas/user.schema';
import { ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import mongoose from 'mongoose';

export const MongoDBModule = [
  MongooseModule.forRootAsync({
    imports: [ConfigsModule],
    useFactory: async (configService: ConfigService) => ({
      uri: configService.get<DatabaseConfig>(ConfigKey.db).mongoDB.uri,
      connectionFactory: (conn) => {
        const appConfig = configService.get<AppConfig>(ConfigKey.app);
        if (appConfig.env === Environment.dev) {
          mongoose.set('debug', (collectionName, method, query, doc) => {
            console.log(
              `${collectionName}.${method}`,
              JSON.stringify(query),
              doc,
            );
          });
        }

        if (conn.readyState === 1) {
          console.log('✅ MongoDB connected');
        }
        return conn;
      },
    }),
    inject: [ConfigService],
  }),
  MongooseModule.forFeature([
    { name: DiscussionModel.name, schema: DiscussionSchema },
    { name: CommentModel.name, schema: CommentSchema },
    { name: UserModel.name, schema: UserSchema },
  ]),
];
