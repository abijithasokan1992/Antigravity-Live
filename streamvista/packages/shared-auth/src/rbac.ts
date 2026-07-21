// src/rbac.ts
export enum Role {
  SUPER_ADMIN = "SUPER_ADMIN",
  CREATOR = "CREATOR",
  BUYER = "BUYER",
  DISTRIBUTOR = "DISTRIBUTOR",
}

// Define permission scopes per role. Adjust as needed.
export const permissions: Record<Role, string[]> = {
  [Role.SUPER_ADMIN]: ["*"], // full access
  [Role.CREATOR]: [
    "project:create",
    "project:read",
    "media:upload",
    "license:create",
  ],
  [Role.BUYER]: ["project:read", "media:consume", "license:purchase"],
  [Role.DISTRIBUTOR]: ["project:read", "media:distribute", "license:manage"],
};
