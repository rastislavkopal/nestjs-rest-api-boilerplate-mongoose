export type TokenParams = Readonly<{
  tokenType: string;
  accessToken: string;
  refreshToken: string;
  expiresIn: Date;
}>;
