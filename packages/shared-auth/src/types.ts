export enum Role {
  SUPER_ADMIN = 'SUPER_ADMIN',
  CREATOR = 'CREATOR',
  BUYER = 'BUYER',
  DISTRIBUTOR = 'DISTRIBUTOR',
}

// Define permission scopes per role
export const permissionMap: Record<Role, string[]> = {
  [Role.SUPER_ADMIN]: [
    'manage:all',
    'view:all',
    'audit:read',
    'audit:write',
  ],
  [Role.CREATOR]: [
    'content:create',
    'content:edit',
    'content:view',
    'audit:read',
  ],
  [Role.BUYER]: [
    'content:view',
    'purchase:execute',
    'audit:read',
  ],
  [Role.DISTRIBUTOR]: [
    'distribution:manage',
    'content:view',
    'audit:read',
  ],
};
