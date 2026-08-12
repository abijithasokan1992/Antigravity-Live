import { createHash, randomBytes } from 'node:crypto';
import { cookies } from 'next/headers';
import {
  isCanonicalRole,
  permissionsForRoles,
  type Role,
  type SessionPrincipal,
} from '@shared-auth/types';

export const SESSION_COOKIE_NAME = 'sv_session';
const DEFAULT_SESSION_TTL_SECONDS = 60 * 60 * 8;

type SessionRow = {
  id: string;
  party_id: string;
  expires_at: string;
};

type PartyRow = {
  id: string;
  email: string;
  display_name: string;
};

type PartyRoleRow = {
  role_type: string;
};

type DbConfig = {
  url: string;
  serviceKey: string;
};

function getDbConfig(): DbConfig | null {
  const url = process.env.SUPABASE_URL?.trim();
  const serviceKey = process.env.SUPABASE_SERVICE_KEY?.trim();

  // Fail closed. Mock or missing credentials must never create an authenticated session.
  if (!url || !serviceKey || url.includes('mock.supabase.co') || serviceKey === 'mock-key') {
    return null;
  }

  return { url: url.replace(/\/$/, ''), serviceKey };
}

async function postgrest<T>(resource: string, init?: RequestInit): Promise<T | null> {
  const config = getDbConfig();
  if (!config) return null;

  try {
    const response = await fetch(`${config.url}/rest/v1/${resource}`, {
      ...init,
      cache: 'no-store',
      headers: {
        apikey: config.serviceKey,
        Authorization: `Bearer ${config.serviceKey}`,
        'Content-Type': 'application/json',
        ...init?.headers,
      },
    });

    if (!response.ok) return null;
    if (response.status === 204) return null;
    return (await response.json()) as T;
  } catch {
    return null;
  }
}

export function hashSessionToken(token: string): string {
  return createHash('sha256').update(token).digest('hex');
}

export async function getServerSession(): Promise<SessionPrincipal | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get(SESSION_COOKIE_NAME)?.value;
  if (!token) return null;

  const tokenHash = hashSessionToken(token);
  const now = new Date().toISOString();

  const sessions = await postgrest<SessionRow[]>(
    `auth_session?select=id,party_id,expires_at&token_hash=eq.${encodeURIComponent(tokenHash)}&revoked_at=is.null&expires_at=gt.${encodeURIComponent(now)}&limit=1`,
  );
  const session = sessions?.[0];
  if (!session) return null;

  const parties = await postgrest<PartyRow[]>(
    `party?select=id,email,display_name&id=eq.${encodeURIComponent(session.party_id)}&limit=1`,
  );
  const party = parties?.[0];
  if (!party) return null;

  const roleRows = await postgrest<PartyRoleRow[]>(
    `party_role?select=role_type&party_id=eq.${encodeURIComponent(session.party_id)}`,
  );

  const roles: Role[] = (roleRows ?? [])
    .map((row) => row.role_type)
    .filter(isCanonicalRole);

  return {
    partyId: party.id,
    email: party.email,
    displayName: party.display_name,
    roles,
    permissions: permissionsForRoles(roles),
    sessionId: session.id,
    expiresAt: session.expires_at,
  };
}

export async function createSessionRecord(
  partyId: string,
  ttlSeconds = DEFAULT_SESSION_TTL_SECONDS,
): Promise<{ token: string; expiresAt: string } | null> {
  const token = randomBytes(32).toString('base64url');
  const tokenHash = hashSessionToken(token);
  const expiresAt = new Date(Date.now() + ttlSeconds * 1000).toISOString();

  const inserted = await postgrest<SessionRow[]>('auth_session', {
    method: 'POST',
    headers: { Prefer: 'return=representation' },
    body: JSON.stringify({
      party_id: partyId,
      token_hash: tokenHash,
      expires_at: expiresAt,
    }),
  });

  if (!inserted?.[0]) return null;
  return { token, expiresAt };
}

export async function revokeSessionRecord(sessionId: string): Promise<boolean> {
  const revokedAt = new Date().toISOString();
  const result = await postgrest<unknown>(`auth_session?id=eq.${encodeURIComponent(sessionId)}`, {
    method: 'PATCH',
    headers: { Prefer: 'return=minimal' },
    body: JSON.stringify({ revoked_at: revokedAt }),
  });

  // PATCH with Prefer:return=minimal returns 204, which postgrest maps to null.
  // A configured DB is therefore the only positive signal we can safely use here.
  return getDbConfig() !== null && result === null;
}
