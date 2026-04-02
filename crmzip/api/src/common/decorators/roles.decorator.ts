import { SetMetadata } from '@nestjs/common';

export const ROLES_KEY = 'roles';
// Accepts any string roles: BusinessRole values, OrganizationRole values, or PlatformRole
export const Roles = (...roles: string[]) => SetMetadata(ROLES_KEY, roles);
