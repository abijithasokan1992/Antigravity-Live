import { redirect } from 'next/navigation';
import type { Permission, SessionPrincipal } from '@shared-auth/types';
import { AuthorizationError, verifySessionAndPermission } from './authorization';
import { getServerSession } from './session';

export async function requirePagePermission(
  requiredPermission: Permission,
): Promise<SessionPrincipal> {
  const session = await getServerSession();

  try {
    return verifySessionAndPermission(session, requiredPermission);
  } catch (error) {
    if (error instanceof AuthorizationError && error.status === 401) {
      redirect('/login');
    }

    redirect('/forbidden');
  }
}
