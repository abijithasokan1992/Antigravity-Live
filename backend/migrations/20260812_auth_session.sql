-- StreamVista server-side session store.
-- This migration is committed only; it is NOT applied to production by this PR action.

CREATE TABLE IF NOT EXISTS auth_session (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    party_id UUID NOT NULL REFERENCES party(id) ON DELETE CASCADE,
    token_hash CHAR(64) NOT NULL UNIQUE,
    expires_at TIMESTAMPTZ NOT NULL,
    revoked_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    last_seen_at TIMESTAMPTZ,
    metadata JSONB NOT NULL DEFAULT '{}'::jsonb,
    CONSTRAINT auth_session_expiry_after_create CHECK (expires_at > created_at)
);

CREATE INDEX IF NOT EXISTS idx_auth_session_party_id
    ON auth_session(party_id);

CREATE INDEX IF NOT EXISTS idx_auth_session_active_lookup
    ON auth_session(token_hash, expires_at)
    WHERE revoked_at IS NULL;
