import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import {
  getServerSession,
  revokeSessionRecord,
  SESSION_COOKIE_NAME,
} from '@/security/session';

export async function POST() {
  const session = await getServerSession();

  if (session) {
    const revoked = await revokeSessionRecord(session.sessionId);
    if (!revoked) {
      return NextResponse.json({ error: 'Logout service unavailable' }, { status: 503 });
    }
  }

  const cookieStore = await cookies();
  cookieStore.set(SESSION_COOKIE_NAME, '', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    expires: new Date(0),
  });

  return NextResponse.json({ authenticated: false });
}
