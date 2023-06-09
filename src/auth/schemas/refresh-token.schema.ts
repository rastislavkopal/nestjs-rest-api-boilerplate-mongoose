import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { now, HydratedDocument, ObjectId, Types } from 'mongoose';
import { Expose, Transform } from 'class-transformer';

export type RefreshTokenDocument = HydratedDocument<RefreshToken>;

@Schema({ timestamps: true })
export class RefreshToken {
  @Expose()
  @Transform((params) => params.obj._id.toString())
  _id: ObjectId;

  @Expose()
  @Transform((params) => params.obj.userId.toString())
  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  userId: ObjectId;

  @Prop({ required: true, unique: true })
  email: string;

  @Prop({ required: true })
  refreshToken: string;

  // @Prop()
  // ip: string;

  // @Prop()
  // browser: string;

  // @Prop()
  // country: string;

  @Prop()
  expires: Date;

  @Prop({ default: now() })
  createdAt: Date;
}

export const RefreshTokenSchema = SchemaFactory.createForClass(RefreshToken);
