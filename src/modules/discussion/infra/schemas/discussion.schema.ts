import {
  UserDocument,
  UserModel,
} from '@modules/user/infra/schemas/user.schema';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';

export type DiscussionDocument = HydratedDocument<DiscussionModel>;

@Schema({ collection: 'discussions', timestamps: true })
export class DiscussionModel {
  @Prop({ required: true })
  title: string;

  @Prop({ required: true })
  description: string;

  @Prop({ type: Types.ObjectId, ref: UserModel.name, required: true })
  author: Types.ObjectId | UserDocument;

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
