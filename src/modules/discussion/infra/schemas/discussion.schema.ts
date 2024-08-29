import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

class CommentModel {
  @Prop({ required: true })
  readonly discussionId: string;

  @Prop({ required: true })
  readonly authorId: string;

  @Prop({ required: true })
  readonly content: string;

  @Prop({ required: true })
  readonly createdAt: Date;

  @Prop({ required: true })
  readonly upvotes: number;

  @Prop({ required: true })
  readonly downvotes: number;
}

export type DiscussionDocument = HydratedDocument<DiscussionModel>;

@Schema({ collection: 'discussions', timestamps: true })
export class DiscussionModel {
  @Prop({ required: true })
  readonly title: string;

  @Prop({ required: true })
  readonly description: string;

  @Prop({ required: true })
  readonly authorId: string;

  @Prop({ required: false, type: [CommentModel], default: [] })
  readonly comments: [CommentModel];

  @Prop({ required: false, default: 0 })
  readonly upvotes: number;

  @Prop({ required: false, default: 0 })
  readonly downvotes: number;

  @Prop({ required: false })
  readonly resolution?: string;

  @Prop({ type: Date })
  createdAt: Date;
}

export const DiscussionSchema = SchemaFactory.createForClass(DiscussionModel);
