import {
  UserDocument,
  UserModel,
} from '@modules/user/infra/schemas/user.schema';
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
}

export const CommentSchema = SchemaFactory.createForClass(CommentModel);
