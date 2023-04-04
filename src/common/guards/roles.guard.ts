import {
  ExecutionContext,
  Injectable,
  CanActivate,
  UnauthorizedException,
  ForbiddenException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Observable } from 'rxjs';
import { ROLES_KEY } from '../decorators/constants';
import { Request } from 'express';

// apply after atguard
// todo: check what is inside request
@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    try {
      const requiredRoles = this.reflector.getAllAndOverride<string[]>(
        ROLES_KEY,
        [context.getHandler(), context.getClass()]
      );
      if (!requiredRoles) return true;
      const request: Request = context.switchToHttp().getRequest();
      const user = request.user;
      return user.roles.some(role => requiredRoles.includes(role.value));
    } catch(_) {
      throw new ForbiddenException({ message: 'Access Denied' });
    }
  }
}
