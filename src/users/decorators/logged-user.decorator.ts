import { createParamDecorator } from '@nestjs/common';

export const LoggedUser = createParamDecorator((data, req) => {
  return req.user;
});
