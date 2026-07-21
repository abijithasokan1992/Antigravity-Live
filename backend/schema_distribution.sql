-- =============================================================================
-- schema_distribution.sql
-- Distribution & Fulfillment Engine Schema for StreamVista OS
-- Run once in Supabase SQL editor
-- =============================================================================

CREATE TABLE IF NOT EXISTS distribution_jobs (
    job_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    license_id UUID REFERENCES licenses(license_id) ON DELETE CASCADE,
    project_id UUID REFERENCES projects(id) ON DELETE CASCADE,
    buyer_id UUID REFERENCES buyers(buyer_id) ON DELETE CASCADE,
    
    destination_type VARCHAR(50), -- e.g., 'S3_BUCKET', 'FTP', 'FAST_INGEST', 'ASPERA'
    destination_url TEXT,
    
    format_preset VARCHAR(100), -- e.g., 'ProRes_422HQ', 'HLS_1080p', 'IMF_Package'
    
    status VARCHAR(50) DEFAULT 'QUEUED', -- QUEUED, TRANSCODING, PACKAGING, DELIVERING, COMPLETED, FAILED
    progress_pct INT DEFAULT 0,
    
    started_at TIMESTAMP,
    completed_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT NOW()
);

-- =============================================================================
-- END OF MIGRATION
-- =============================================================================
