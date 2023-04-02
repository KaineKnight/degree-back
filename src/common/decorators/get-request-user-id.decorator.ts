import { ExecutionContext, createParamDecorator } from '@nestjs/common';

import { USER_ID } from './constants';

export const GetRequestUserId = createParamDecorator(
  (data: undefined, context: ExecutionContext): number => {
    const request = context.switchToHttp().getRequest();
    const user = request.user[USER_ID];
    return user;
  },
);
