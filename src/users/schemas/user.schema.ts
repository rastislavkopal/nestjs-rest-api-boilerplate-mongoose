import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { now, HydratedDocument, ObjectId } from 'mongoose';
// import * as mongoose from 'mongoose';
// import { Article } from '../articles/schemas/article.schema';
import { Exclude, Expose, Transform } from 'class-transformer';

export type UserDocument = HydratedDocument<User>;

@Schema({ timestamps: true })
export class User {
  @Expose()
  @Transform((params) => params.obj._id.toString())
  _id: ObjectId;

  @Prop({ required: true, unique: true, minlength: 6, maxlength: 255 })
  email: string;

  @Prop({ required: true })
  @Exclude()
  password: string;

  name: string;

  @Prop({ required: true })
  firstName: string;

  @Prop({ required: true })
  lastName: string;

  @Prop({ type: [String], default: ['user'], required: true })
  roles: string;

  @Prop()
  picture: string;

  @Prop({ default: false })
  verified: boolean;

  @Prop({ default: 0 })
  @Exclude()
  loginAttempts: number;

  @Prop()
  invitedBy: string;

  @Prop({ default: 0 })
  nReviews: number;

  @Prop({ default: 0 })
  nBeenVoted: number;

  // @Prop({ type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Article' }] })
  // savedArticles: SavedArticle[];

  @Prop({ default: 1 })
  level: number;

  @Prop({ default: now() })
  createdAt: Date;

  @Prop({ default: now() })
  updatedAt: Date;
}

export const UserSchema = SchemaFactory.createForClass(User);
