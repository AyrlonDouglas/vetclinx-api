import { UserModel } from '@modules/user/infra/schemas/user.schema';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';

export type CommentDocument = HydratedDocument<CommentModel>;

@Schema({ timestamps: true })
export class CommentModel {
  @Prop({ required: true })
  discussionId: string;

  @Prop({ required: true })
  authorId: string;

  @Prop({ required: true })
  content: string;

  @Prop({ required: true })
  createdAt: Date;

  @Prop({ required: true })
  upvotes: number;

  @Prop({ required: true })
  downvotes: number;
}

export type DiscussionDocument = HydratedDocument<DiscussionModel>;

@Schema({ collection: 'discussions', timestamps: true })
export class DiscussionModel {
  @Prop({ required: true })
  title: string;

  @Prop({ required: true })
  description: string;

  @Prop({ type: Types.ObjectId, ref: UserModel.name, required: true })
  authorId: Types.ObjectId;

  @Prop({
    required: false,
    type: [CommentModel],
    default: [],
  })
  comments: [];

  @Prop({ required: false, default: 0 })
  upvotes: number;

  @Prop({ required: false, default: 0 })
  downvotes: number;

  @Prop({ required: false })
  resolution: string;

  @Prop({ type: Date, required: true })
  createdAt: Date;

  @Prop({ type: Date, required: true })
  updatedAt: Date;
}

export const DiscussionSchema = SchemaFactory.createForClass(DiscussionModel);
