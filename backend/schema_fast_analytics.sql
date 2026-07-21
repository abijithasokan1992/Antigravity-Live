-- =============================================================================
-- schema_fast_analytics.sql
-- Telemetry and Monetization Tracking for FAST Channels
-- Run once in Supabase SQL editor
-- =============================================================================

CREATE TABLE IF NOT EXISTS fast_viewer_sessions (
    session_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    viewer_ip_hash VARCHAR(255) NOT NULL, -- Anonymized IP hash
    channel_id VARCHAR(100) NOT NULL, -- e.g., 'crayons-loop-malayalam'
    country_code VARCHAR(2), -- e.g., 'IN', 'US', 'AE'
    device_type VARCHAR(50), -- 'SMART_TV', 'MOBILE', 'WEB'
    started_at TIMESTAMP DEFAULT NOW(),
    last_ping_at TIMESTAMP,
    duration_seconds INT DEFAULT 0
);

CREATE TABLE IF NOT EXISTS fast_ad_impressions (
    impression_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    session_id UUID REFERENCES fast_viewer_sessions(session_id) ON DELETE CASCADE,
    ad_campaign_id VARCHAR(100),
    ad_pod_id VARCHAR(100), -- The specific commercial break
    quartile_reached INT DEFAULT 0, -- 0=Started, 1=25%, 2=50%, 3=75%, 4=Complete
    revenue_micros BIGINT DEFAULT 0, -- Estimated eCPM revenue tracked in micro-dollars
    timestamp TIMESTAMP DEFAULT NOW()
);

-- Index for real-time Concurrent Viewers (CCV) aggregation
CREATE INDEX IF NOT EXISTS idx_fast_viewer_last_ping 
    ON fast_viewer_sessions(last_ping_at);

-- =============================================================================
-- END OF MIGRATION
-- =============================================================================
