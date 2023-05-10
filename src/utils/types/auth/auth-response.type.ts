import { User } from '../../../users/schemas/user.schema';
import { TokenParams } from './token-parameters.type';

export type AuthResponseType = Readonly<{
  token: TokenParams;
  user: User;
}>;
