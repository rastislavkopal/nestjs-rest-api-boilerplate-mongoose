import { TokenParams } from './token-parameters.type';

export type AuthResponseType = Readonly<{
  token: TokenParams;
  user: any;
}>;
