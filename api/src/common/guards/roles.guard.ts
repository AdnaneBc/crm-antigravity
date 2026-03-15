import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ROLES_KEY } from '../decorators/roles.decorator';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.getAllAndOverride<string[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    if (!requiredRoles) return true;

    const { user } = context.switchToHttp().getRequest();

    // Platform SUPER_ADMIN bypasses all restrictions
    if (user.platformRole === 'SUPER_ADMIN') return true;

    // Allow by businessRole or organizationRole
    return requiredRoles.some(
      (r) => r === user.businessRole || r === user.organizationRole || r === user.platformRole,
    );
  }
}
