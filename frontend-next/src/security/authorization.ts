import type { Permission, SessionPrincipal } from '@shared-auth/types';
import { getServerSession } from './session';

export class AuthorizationError extends Error {
  readonly status: 401 | 403;

  constructor(status: 401 | 403, message: string) {
    super(message);
    this.name = 'AuthorizationError';
    this.status = status;
  }
}

export function verifySessionAndPermission(
  session: SessionPrincipal | null,
  requiredPermission: Permission,
): SessionPrincipal {
  if (!session) {
    throw new AuthorizationError(401, 'Authentication required');
  }

  if (!session.permissions.includes(requiredPermission)) {
    throw new AuthorizationError(403, 'Permission denied');
  }

  return session;
}

export async function requirePermission(
  requiredPermission: Permission,
): Promise<SessionPrincipal> {
  const session = await getServerSession();
  return verifySessionAndPermission(session, requiredPermission);
}

export async function requireAuthenticatedSession(): Promise<SessionPrincipal> {
  const session = await getServerSession();
  if (!session) {
    throw new AuthorizationError(401, 'Authentication required');
  }
  return session;
}
