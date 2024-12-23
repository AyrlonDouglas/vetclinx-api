import {
  UserDocument,
  UserModel,
} from '@modules/user/infra/repositories/entities/userMongoose.schema';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';
import {
  VoteFor,
  VoteTypes,
} from '@modules/discussion/domain/component/voteManager.component';

export type VoteDocument = HydratedDocument<VoteModel>;

@Schema({ collection: 'votes', timestamps: true })
export class VoteModel {
  @Prop({ type: Types.ObjectId, ref: UserModel.name, required: true })
  user: Types.ObjectId | UserDocument;

  @Prop({ type: String, enum: Object.values(VoteTypes), required: true })
  voteType: keyof typeof VoteTypes;

  @Prop({ type: String, enum: Object.values(VoteFor), required: true })
  voteFor: keyof typeof VoteFor;

  @Prop({ type: Types.ObjectId, required: true })
  voteForReferency: Types.ObjectId;

  @Prop({ type: Date, required: true })
  createdAt: Date;

  @Prop({ type: Date })
  updatedAt: Date;
}

export const VoteSchema = SchemaFactory.createForClass(VoteModel);
