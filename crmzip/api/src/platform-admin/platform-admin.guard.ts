import { Injectable, CanActivate, ExecutionContext, ForbiddenException } from '@nestjs/common';

@Injectable()
export class PlatformAdminGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    const user = request.user;

    if (!user || user.platformRole !== 'SUPER_ADMIN') {
      throw new ForbiddenException('Access restricted to Super Admins');
    }

    return true;
  }
}
