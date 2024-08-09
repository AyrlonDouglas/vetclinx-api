import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type UserDocument = HydratedDocument<UserModel>;

@Schema({ collection: 'users' })
export class UserModel {
  @Prop({ required: true })
  readonly name: string;

  @Prop({ required: true })
  readonly username: string;

  @Prop({ required: true })
  readonly email: string;

  @Prop({ required: true })
  readonly password: string;
}

export const UserSchema = SchemaFactory.createForClass(UserModel);
