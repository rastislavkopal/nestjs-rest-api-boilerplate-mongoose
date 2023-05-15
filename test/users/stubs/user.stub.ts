// import mongoose from 'mongoose';
// import { User } from '../../../src/users/schemas/user.schema';
import { CreateUserDto } from 'src/users/dto/create-user.dto';

export const userStub = (): CreateUserDto => {
  return {
    // _id: new mongoose.Schema.Types.ObjectId('586d62878fc14d30e0ac5379'),
    email: 'test@example.com',
    password: 'aasdasd',
    firstName: 'John',
    lastName: 'Doe',
    // name: `John Doe`,
    // roles: ['user'],
    // picture: 'aaa',
    // verified: false,
    // loginAttempts: 1,
    // invitedBy: 'aa',
    // nReviews: 3,
    // nBeenVoted: 2,
    // level: 1,
    // createdAt: new Date(),
    // updatedAt: new Date(),
  };
};
