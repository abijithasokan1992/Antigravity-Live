// packages/rbac/src/index.ts
export enum Role {
  SUPER_ADMIN = "SUPER_ADMIN",
  CREATOR = "CREATOR",
  BUYER = "BUYER",
  DISTRIBUTOR = "DISTRIBUTOR",
}

export type PermissionScope = {
  read: string[];
  write: string[];
  admin: string[];
};

export const rolePermissions: Record<Role, PermissionScope> = {
  [Role.SUPER_ADMIN]: {
    read: ["*"],
    write: ["*"],
    admin: ["*"],
  },
  [Role.CREATOR]: {
    read: ["project:own", "asset:own"],
    write: ["project:create", "asset:upload"],
    admin: [],
  },
  [Role.BUYER]: {
    read: ["project:published", "asset:public"],
    write: ["order:create"],
    admin: [],
  },
  [Role.DISTRIBUTOR]: {
    read: ["project:*", "asset:*"],
    write: ["distribution:create", "distribution:update"],
    admin: [],
  },
} as const;
