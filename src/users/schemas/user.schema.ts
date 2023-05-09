import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
// import * as mongoose from 'mongoose';
// import { Article } from '../articles/schemas/article.schema';
// import { Exclude, Expose } from 'class-transformer';

export type UserDocument = HydratedDocument<User>;

@Schema()
export class User {
  @Prop({ required: true, unique: true, minlength: 6, maxlength: 255 })
  email: string;

  @Prop({ required: true })
  password: string;

  name: string;

  @Prop({ required: true })
  firstName: string;

  @Prop({ required: true })
  lastName: string;

  @Prop({ default: 'user', required: true })
  role: string;

  @Prop()
  picture: string;

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
}

const UserSchema = SchemaFactory.createForClass(User);

UserSchema.virtual('name').get(function (this: UserDocument) {
  return `${this.firstName} ${this.lastName}`;
});

export { UserSchema };
