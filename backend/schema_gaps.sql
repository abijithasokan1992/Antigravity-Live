-- =============================================================================
-- schema_gaps.sql
-- Gap-fill migration: Deliverables Manifest + Financial Ledger + Payout Engine
-- Run once in Supabase SQL editor (or via supabase db push)
-- =============================================================================

-- ---------------------------------------------------------------------------
-- 1. DELIVERY MANIFEST
--    Tracks every channel-specific asset bundle generated for a title.
--    One row per (title × channel) package request.
-- ---------------------------------------------------------------------------

CREATE TABLE IF NOT EXISTS delivery_manifest (
    id                  UUID            PRIMARY KEY DEFAULT gen_random_uuid(),
    title_id            UUID            NOT NULL REFERENCES title(id) ON DELETE CASCADE,
    channel_name        VARCHAR(100)    NOT NULL,           -- e.g. 'Sun NXT', 'Amazon Prime'
    target_spec_preset  VARCHAR(50)     NOT NULL DEFAULT 'STANDARD_H264',
        -- ENUM candidates: 'PRORES_422_HQ' | 'SUN_NXT_SPEC' | 'AMAZON_MEzz' |
        --                  'ZEE5_SPEC'     | 'BMS_SPEC'     | 'STANDARD_H264'
    manifest_sku        VARCHAR(120)    NOT NULL UNIQUE,    -- auto-generated, e.g. SKU_JANANAM_SUNNXT
    bundle_s3_key       TEXT,                               -- S3 object key of the ZIP
    bundle_s3_url       TEXT,                               -- presigned / public CDN URL
    zip_checksum_sha256 VARCHAR(64),                        -- SHA-256 of the final ZIP
    included_assets     JSONB           NOT NULL DEFAULT '[]'::JSONB,
        -- Array of { asset_type, s3_key, file_name, size_bytes }
    platform_metadata   JSONB           NOT NULL DEFAULT '{}'::JSONB,
        -- Channel-specific CSV/JSON metadata payload
    status              VARCHAR(50)     NOT NULL DEFAULT 'generating',
        -- 'generating' | 'ready' | 'failed'
    error_detail        TEXT,
    generated_at        TIMESTAMPTZ     NOT NULL DEFAULT NOW(),
    expires_at          TIMESTAMPTZ     GENERATED ALWAYS AS (generated_at + INTERVAL '30 days') STORED
);

CREATE INDEX IF NOT EXISTS idx_delivery_manifest_title
    ON delivery_manifest (title_id);

CREATE INDEX IF NOT EXISTS idx_delivery_manifest_status
    ON delivery_manifest (status);

-- ---------------------------------------------------------------------------
-- 2. FINANCIAL LEDGER
--    One row per reporting period per channel per title.
--    Supports two-tier: estimated (unreconciled) → reconciled → paid.
--    Stores both fixed-fee and revenue-share deal types on the same row.
-- ---------------------------------------------------------------------------

CREATE TABLE IF NOT EXISTS financial_ledger (
    id                      UUID            PRIMARY KEY DEFAULT gen_random_uuid(),
    title_id                UUID            NOT NULL REFERENCES title(id) ON DELETE CASCADE,
    channel_party_id        UUID            REFERENCES party(id),   -- platform that reported revenue
    reporting_period_start  DATE            NOT NULL,
    reporting_period_end    DATE            NOT NULL,
    deal_type               VARCHAR(30)     NOT NULL DEFAULT 'revenue_share',
        -- 'revenue_share' | 'fixed_fee'

    -- Revenue Share fields
    gross_revenue           NUMERIC(14, 2)  NOT NULL DEFAULT 0.00,
    distributor_split_pct   NUMERIC(5, 2)   NOT NULL DEFAULT 20.00, -- platform/distributor cut %
    platform_deduction      NUMERIC(14, 2)  NOT NULL DEFAULT 0.00,  -- withholding tax, transfer fees
    net_creator_share       NUMERIC(14, 2)  NOT NULL DEFAULT 0.00,  -- computed by API before insert

    -- Fixed Fee fields
    fixed_fee_amount        NUMERIC(14, 2)  NOT NULL DEFAULT 0.00,  -- MG / flat licence fee
    fixed_fee_paid          BOOLEAN         NOT NULL DEFAULT FALSE,

    currency                VARCHAR(3)      NOT NULL DEFAULT 'INR',
    stream_count_estimate   BIGINT          DEFAULT 0,              -- unverified plays reported
    stream_count_final      BIGINT          DEFAULT 0,              -- reconciled play count

    statement_status        VARCHAR(50)     NOT NULL DEFAULT 'estimated',
        -- 'estimated' | 'reconciled' | 'paid'

    source_document_url     TEXT,           -- link to original channel statement PDF/CSV
    notes                   TEXT,
    created_at              TIMESTAMPTZ     NOT NULL DEFAULT NOW(),
    reconciled_at           TIMESTAMPTZ,
    paid_at                 TIMESTAMPTZ,

    CONSTRAINT chk_period CHECK (reporting_period_end >= reporting_period_start),
    CONSTRAINT chk_split   CHECK (distributor_split_pct BETWEEN 0 AND 100)
);

CREATE INDEX IF NOT EXISTS idx_financial_ledger_title
    ON financial_ledger (title_id);

CREATE INDEX IF NOT EXISTS idx_financial_ledger_status
    ON financial_ledger (statement_status);

CREATE INDEX IF NOT EXISTS idx_financial_ledger_period
    ON financial_ledger (reporting_period_end DESC);

-- ---------------------------------------------------------------------------
-- 3. PHASE 1 CORE MODIFICATIONS
--    Updates to foundation tables to support Message Threads and Rights Avails
-- ---------------------------------------------------------------------------

ALTER TABLE thread ADD COLUMN IF NOT EXISTS email_reply_to_token VARCHAR(255) UNIQUE;
ALTER TABLE message ADD COLUMN IF NOT EXISTS is_system_event BOOLEAN NOT NULL DEFAULT FALSE;
ALTER TABLE rights_avails ADD COLUMN IF NOT EXISTS deal_structure VARCHAR(50);

-- ---------------------------------------------------------------------------
-- 4. HELPER VIEW: Creator Balance Summary
--    Aggregates net_creator_share across all ledger rows by creator.
-- ---------------------------------------------------------------------------

CREATE OR REPLACE VIEW creator_balance_summary AS
SELECT
    p.id                                                    AS creator_party_id,
    p.display_name                                          AS creator_name,
    COALESCE(SUM(fl.net_creator_share), 0)                 AS total_earned,
    COALESCE(SUM(CASE WHEN fl.statement_status = 'paid'
                      THEN fl.net_creator_share ELSE 0 END), 0) AS total_paid_out,
    COALESCE(SUM(CASE WHEN fl.statement_status IN ('estimated','reconciled')
                      THEN fl.net_creator_share ELSE 0 END), 0) AS available_balance,
    COALESCE(SUM(CASE WHEN fl.statement_status = 'estimated'
                      THEN fl.net_creator_share ELSE 0 END), 0) AS estimated_pending,
    COALESCE(SUM(CASE WHEN fl.statement_status = 'reconciled'
                      THEN fl.net_creator_share ELSE 0 END), 0) AS reconciled_ready
FROM party p
LEFT JOIN title t ON t.owner_party_id = p.id
LEFT JOIN financial_ledger fl ON fl.title_id = t.id
WHERE EXISTS (
    SELECT 1 FROM party_role pr 
    WHERE pr.party_id = p.id AND pr.role_type = 'creator'
)
GROUP BY p.id, p.display_name;

-- =============================================================================
-- END OF MIGRATION
-- =============================================================================
