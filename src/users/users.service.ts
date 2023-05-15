import { _, omit } from 'lodash';
import { Model, Types } from 'mongoose';
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User, UserDocument } from './schemas/user.schema';
import { CreateUserDto } from './dto/create-user.dto';
import { NullableType } from '../utils/types/nullable.type';
import { UpdateUserDto } from './dto/update-user.dto';
import { ReplaceUserDto } from './dto/replace-user.dto';

@Injectable()
export class UsersService {
  constructor(@InjectModel(User.name) private userModel: Model<User>) {}

  async create(createUserDto: CreateUserDto): Promise<User> {
    const createdUser: UserDocument = new this.userModel(createUserDto);
    return createdUser.save();
  }

  async findOne(query: object): Promise<NullableType<User>> {
    return this.userModel.findOne(query);
  }

  async findByEmail(email: string): Promise<NullableType<User>> {
    return this.userModel.findOne({ email }).exec();
  }

  async findById(_id: Types.ObjectId): Promise<NullableType<User>> {
    return this.userModel.findById(_id).exec();
  }

  async findManyWithPagination(page = 1, limit?: number): Promise<User[]> {
    return this.userModel
      .find()
      .skip(page * limit)
      .limit(limit)
      .exec();
  }

  async update(
    _id: Types.ObjectId,
    user: User,
    updateUserDto: UpdateUserDto,
  ): Promise<User> {
    const ommitRoles: string = _.includes(user.roles, 'admin') ? 'roles' : '';
    updateUserDto = omit(updateUserDto, ommitRoles);

    const updatedUser: User = await this.userModel.findByIdAndUpdate(
      _id,
      updateUserDto,
      {
        returnOriginal: false,
      },
    );
    if (!updatedUser) {
      throw new NotFoundException(`User #${user._id} not found`);
    }
    return updatedUser;
  }

  async replace(
    _id: Types.ObjectId,
    user: User,
    userDto: ReplaceUserDto,
  ): Promise<User> {
    if (!_.includes(user.roles, 'admin')) userDto = omit(userDto, 'roles');

    return await this.userModel.findByIdAndUpdate(_id, userDto, {
      override: true,
      upsert: true,
      returnOriginal: false,
    });
  }

  async delete(userId: Types.ObjectId): Promise<User> {
    const deletedUser = await this.userModel.findByIdAndDelete(userId);
    if (!deletedUser) {
      throw new NotFoundException(`User #${userId} not found`);
    }
    return deletedUser;
  }
}
