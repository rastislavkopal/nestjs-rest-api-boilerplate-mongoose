import { Model } from 'mongoose';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User } from './schemas/user.schema';
import { CreateUserDto } from './dto/create-user.dto';
import { NullableType } from 'src/utils/types/nullable.type';

@Injectable()
export class UsersService {
  constructor(@InjectModel(User.name) private userModel: Model<User>) {}

  async create(createUserDto: CreateUserDto): Promise<User> {
    const createdUser = new this.userModel(createUserDto);
    return createdUser.save();
  }

  async findByEmail(email: string): Promise<NullableType<User>> {
    return this.userModel.findOne({ email }).exec();
  }

  async findById(id: string): Promise<NullableType<User>> {
    return this.userModel.findById(id).exec();
  }

  async findManyWithPagination(page = 1, limit?: number): Promise<User[]> {
    return this.userModel
      .find()
      .skip(page * limit)
      .limit(limit)
      .exec();
  }
}
