import { Role, PermissionScope } from './types';

export const permissionScopes: Record<Role, PermissionScope> = {
  [Role.SUPER_ADMIN]: ['*'],
  [Role.CREATOR]: [
    'project:create',
    'project:read',
    'project:update',
    'media:upload',
    'media:download',
    'audit:read',
  ],
  [Role.BUYER]: [
    'project:read',
    'media:download',
    'audit:read',
  ],
  [Role.DISTRIBUTOR]: [
    'project:read',
    'media:download',
    'audit:read',
    'user:manage',
  ],
};
