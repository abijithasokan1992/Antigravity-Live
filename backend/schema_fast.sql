-- =============================================================================
-- schema_fast.sql
-- Final 15th Table Migration: FAST Channel Playout Engine
-- Run once in Supabase SQL editor
-- =============================================================================

CREATE TABLE IF NOT EXISTS fast_schedules (
    id                  UUID            PRIMARY KEY DEFAULT gen_random_uuid(),
    title_id            UUID            NOT NULL REFERENCES title(id) ON DELETE CASCADE,
    start_time          TIMESTAMPTZ     NOT NULL,
    end_time            TIMESTAMPTZ     NOT NULL,
    title               VARCHAR(255)    NOT NULL,
    description         TEXT,
    category            VARCHAR(100)    DEFAULT 'Movie',
    poster_url          TEXT,
    created_at          TIMESTAMPTZ     NOT NULL DEFAULT NOW(),
    
    CONSTRAINT chk_fast_time CHECK (end_time > start_time)
);

CREATE INDEX IF NOT EXISTS idx_fast_schedules_start_time
    ON fast_schedules (start_time);

CREATE INDEX IF NOT EXISTS idx_fast_schedules_end_time
    ON fast_schedules (end_time);

-- =============================================================================
-- END OF MIGRATION
-- =============================================================================
