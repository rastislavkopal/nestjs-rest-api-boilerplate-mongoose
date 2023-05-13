import { _, omit } from 'lodash';
import { Model, Types } from 'mongoose';
import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User, UserDocument } from './schemas/user.schema';
import { CreateUserDto } from './dto/create-user.dto';
import { NullableType } from 'src/utils/types/nullable.type';
import { UpdateUserDto } from './dto/update-user.dto';
import { ReplaceUserDto } from './dto/replace-user.dto';
import { plainToClass } from 'class-transformer';

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

  async update(user: User, updateUserDto: UpdateUserDto): Promise<User> {
    const ommitRoles: string = _.includes(user.roles, 'admin') ? 'roles' : '';
    updateUserDto = omit(updateUserDto, ommitRoles);

    const updatedUser: User = await this.userModel.findByIdAndUpdate(
      user._id,
      updateUserDto,
      {
        returnOriginal: false,
      },
    );
    if (!updatedUser) {
      throw new NotFoundException(`Student #${user._id} not found`);
    }
    return updatedUser;
  }

  // TODO .. not really working :)
  async replace(user: User, replaceUserDto: ReplaceUserDto): Promise<User> {
    const ommitRoles: string = _.includes(user.roles, 'admin') ? 'roles' : '';
    const newUser: User = plainToClass(User, replaceUserDto);
    const newUserObject: User = omit(newUser, '_id', ommitRoles);
    Logger.log(newUserObject);
    return this.userModel.findOneAndReplace({ _id: user._id }, newUserObject, {
      override: true,
      upsert: true,
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
