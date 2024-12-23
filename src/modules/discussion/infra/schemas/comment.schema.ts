import {
  UserDocument,
  UserModel,
} from '@modules/user/infra/repositories/entities/userMongoose.schema';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';
import { DiscussionDocument, DiscussionModel } from './discussion.schema';

export type CommentDocument = HydratedDocument<CommentModel>;

@Schema({ collection: 'comments', timestamps: true })
export class CommentModel {
  @Prop({ type: Types.ObjectId, ref: DiscussionModel.name, required: true })
  discussion: Types.ObjectId | DiscussionDocument;

  @Prop({ type: Types.ObjectId, ref: UserModel.name, required: true })
  author: Types.ObjectId | UserDocument;

  @Prop({ required: true })
  content: string;

  @Prop({ type: Date, required: true })
  createdAt: Date;

  @Prop({ type: Date })
  updatedAt: Date;

  @Prop({ required: true })
  upvotes: number;

  @Prop({ required: true })
  downvotes: number;

  @Prop({ type: Number, required: true })
  commentCount: number;

  @Prop({ type: Types.ObjectId, ref: CommentModel.name, required: false })
  parentCommentId: Types.ObjectId;
}

export const CommentSchema = SchemaFactory.createForClass(CommentModel);
