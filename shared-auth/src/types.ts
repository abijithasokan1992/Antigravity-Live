export enum Role {
  SUPER_ADMIN = 'SUPER_ADMIN',
  CREATOR = 'CREATOR',
  BUYER = 'BUYER',
  DISTRIBUTOR = 'DISTRIBUTOR',
}

// Permission identifiers – can be expanded later
export type Permission =
  | '*'
  | 'project:create'
  | 'project:read'
  | 'project:update'
  | 'project:delete'
  | 'media:upload'
  | 'media:download'
  | 'audit:read'
  | 'user:manage';

export type PermissionScope = Permission[];
