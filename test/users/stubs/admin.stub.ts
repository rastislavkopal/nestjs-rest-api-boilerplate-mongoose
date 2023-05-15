import mongoose from 'mongoose';
import { User } from '../../../src/users/schemas/user.schema';

export const adminStub = (): User => {
  return {
    _id: new mongoose.Schema.Types.ObjectId('586d62878fc14d30e0ac5378'),
    email: 'admin@example.com',
    password: 'admin',
    firstName: 'John',
    lastName: 'Admin',
    name: `John Admin`,
    roles: ['admin', 'user'],
    picture: 'picture',
    verified: false,
    loginAttempts: 1,
    invitedBy: 'aa',
    nReviews: 3,
    nBeenVoted: 2,
    level: 1,
    createdAt: new Date(),
    updatedAt: new Date(),
  };
};
