import { User } from '../../../users/schemas/user.schema';

export type JwtPayloadType = User & {
  iat: number;
  exp: number;
};
