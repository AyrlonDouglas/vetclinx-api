import { countries } from '@common/constants/countries';
import {
  UserStatus,
  UserType,
} from '@modules/user/domain/entities/user.entity';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, SchemaTypes } from 'mongoose';

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

  @Prop({ required: true, type: String, enum: Object.values(UserStatus) })
  status: keyof typeof UserStatus;

  @Prop({ required: false })
  phoneNumber?: string;

  @Prop({ required: true, type: SchemaTypes.Date })
  birthDate: Date;

  @Prop({ required: true, type: String, enum: Object.values(UserType) })
  userType: keyof typeof UserType;

  @Prop({ required: true, type: String })
  institution: string;

  @Prop({ required: true, type: SchemaTypes.Date })
  graduationDate: Date;

  @Prop({ required: false, type: [String] })
  specialization?: string[];

  @Prop({
    required: function (this: UserModel) {
      return this.userType === UserType.veterinarian;
    },
    type: String,
  })
  professionalRegistration?: string;

  @Prop({ required: true, type: String })
  country: (typeof countries)[number]['alpha3'];
}

export const UserSchema = SchemaFactory.createForClass(UserModel);
