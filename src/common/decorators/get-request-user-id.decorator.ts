import { ExecutionContext, createParamDecorator } from '@nestjs/common';
import jwtDecode from 'jwt-decode';

import { USER_ID } from './constants';

export const GetRequestUserId = createParamDecorator(
  (data: undefined, context: ExecutionContext): number => {
    try {
      const request = context.switchToHttp().getRequest();
      const user = request?.user;
      if (user) return user[USER_ID];
      if (request.headers['authorization']) {
        const token = request.headers['authorization'];
        const decoded = jwtDecode(token);
        return decoded[USER_ID] || null;
      }
      return null;
    } catch (_) {
      return null;
    }
  },
);
