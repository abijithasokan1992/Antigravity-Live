-- StreamVista Operator QC Checklist Schema
CREATE TABLE IF NOT EXISTS qc_operator_checklist (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title_id UUID NOT NULL REFERENCES title(id) ON DELETE CASCADE,
    operator_party_id UUID NOT NULL REFERENCES party(id),
    
    -- Main Master Inspection
    master_audio_sync_ok BOOLEAN NOT NULL DEFAULT FALSE,
    master_aspect_ratio_ok BOOLEAN NOT NULL DEFAULT FALSE,
    master_no_burned_slates BOOLEAN NOT NULL DEFAULT FALSE,
    master_correct_duration BOOLEAN NOT NULL DEFAULT FALSE,
    
    -- Secondary Assets
    subtitles_timing_ok BOOLEAN NOT NULL DEFAULT FALSE,
    censor_certificate_verified BOOLEAN NOT NULL DEFAULT FALSE,
    artwork_metadata_complete BOOLEAN NOT NULL DEFAULT FALSE,
    
    status VARCHAR(50) NOT NULL DEFAULT 'in_progress', -- 'in_progress', 'approved', 'rejected'
    notes TEXT,
    completed_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
