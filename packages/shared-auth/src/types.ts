import policy from './permissions.json';

export const rolePolicy = policy;

export type Role = keyof typeof rolePolicy.roles;
export type Permission = (typeof rolePolicy.roles)[Role]['permissions'][number];

export type SessionPrincipal = {
  partyId: string;
  email: string;
  displayName: string;
  roles: Role[];
  permissions: Permission[];
  sessionId: string;
  expiresAt: string;
};

export function isCanonicalRole(value: string): value is Role {
  return Object.prototype.hasOwnProperty.call(rolePolicy.roles, value);
}

export function permissionsForRoles(roles: readonly Role[]): Permission[] {
  const granted = new Set<Permission>();

  for (const role of roles) {
    for (const permission of rolePolicy.roles[role].permissions) {
      granted.add(permission as Permission);
    }
  }

  return [...granted];
}
