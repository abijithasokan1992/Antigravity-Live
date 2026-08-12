import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import {
  createSessionRecord,
  SESSION_COOKIE_NAME,
  verifyPasswordCredentials,
} from '@/security/session';

export async function POST(request: Request) {
  let body: { email?: unknown; password?: unknown };

  try {
    body = (await request.json()) as { email?: unknown; password?: unknown };
  } catch {
    return NextResponse.json({ error: 'Invalid request' }, { status: 400 });
  }

  const email = typeof body.email === 'string' ? body.email : '';
  const password = typeof body.password === 'string' ? body.password : '';
  if (!email || !password) {
    return NextResponse.json({ error: 'Email and password are required' }, { status: 400 });
  }

  const partyId = await verifyPasswordCredentials(email, password);
  if (!partyId) {
    return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
  }

  const created = await createSessionRecord(partyId);
  if (!created) {
    return NextResponse.json({ error: 'Authentication service unavailable' }, { status: 503 });
  }

  const cookieStore = await cookies();
  cookieStore.set(SESSION_COOKIE_NAME, created.token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    expires: new Date(created.expiresAt),
    priority: 'high',
  });

  return NextResponse.json({ authenticated: true });
}
