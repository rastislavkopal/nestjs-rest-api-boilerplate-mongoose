import {
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { User } from 'src/users/schemas/user.schema';
import { ValidationArguments } from 'class-validator/types/validation/ValidationArguments';
import { Injectable } from '@nestjs/common';

@Injectable()
@ValidatorConstraint({ name: 'UniqueValidator', async: true })
export class UniqueValidator implements ValidatorConstraintInterface {
  constructor(@InjectModel(User.name) private userModel: Model<User>) {}

  async validate(value: any, args?: ValidationArguments): Promise<boolean> {
    const filter = {};
    filter[args.property] = value;
    const count = await this.userModel.count(filter);
    return !count;
  }

  defaultMessage(args: ValidationArguments) {
    return `${args[0]} is already taken`;
  }
}
