-- =============================================================================
-- schema_creator_cloud.sql
-- Creator Cloud Foundation & Auth Schema
-- Run once in Supabase SQL editor
-- =============================================================================

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. Identity & Access
CREATE TABLE IF NOT EXISTS users (
    user_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    full_name VARCHAR(255),
    email VARCHAR(255) UNIQUE,
    account_status VARCHAR(50),
    created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS organizations (
    organization_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    legal_name VARCHAR(255),
    organization_type VARCHAR(50) -- e.g., 'DI Studio', 'Production House'
);

CREATE TABLE IF NOT EXISTS memberships (
    membership_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(user_id) ON DELETE CASCADE,
    organization_id UUID REFERENCES organizations(organization_id) ON DELETE CASCADE,
    role VARCHAR(50), -- e.g., 'Producer', 'DIT', 'Editor'
    status VARCHAR(50)
);

-- 2. Project & Media Hierarchy
CREATE TABLE IF NOT EXISTS projects (
    project_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    organization_id UUID REFERENCES organizations(organization_id) ON DELETE CASCADE,
    name VARCHAR(255),
    status VARCHAR(50) -- 'DRAFT', 'SHOOTING', 'INGEST ACTIVE', etc.
);

CREATE TABLE IF NOT EXISTS shoot_days (
    shoot_day_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    project_id UUID REFERENCES projects(project_id) ON DELETE CASCADE,
    shoot_date DATE,
    unit_name VARCHAR(100)
);

CREATE TABLE IF NOT EXISTS camera_cards (
    card_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    shoot_day_id UUID REFERENCES shoot_days(shoot_day_id) ON DELETE CASCADE,
    card_label VARCHAR(100),
    ingest_status VARCHAR(50),
    verification_status VARCHAR(50), -- 'SAFE TO FORMAT', 'MISMATCH', 'PENDING'
    cleared_for_formatting BOOLEAN DEFAULT FALSE
);

CREATE TABLE IF NOT EXISTS assets (
    asset_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    project_id UUID REFERENCES projects(project_id) ON DELETE CASCADE,
    card_id UUID REFERENCES camera_cards(card_id) ON DELETE CASCADE,
    asset_type VARCHAR(50), -- 'CAMERA_RAW', 'PROXY'
    storage_object_key TEXT,
    file_size BIGINT,
    checksum VARCHAR(256),
    status VARCHAR(50)
);

-- 3. Jobs & Audit
CREATE TABLE IF NOT EXISTS jobs (
    job_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    job_type VARCHAR(50), -- 'PROXY_GENERATION', 'TECHNICAL_QC'
    asset_id UUID REFERENCES assets(asset_id) ON DELETE CASCADE,
    status VARCHAR(50),
    progress_percentage INT
);

CREATE TABLE IF NOT EXISTS audit_logs (
    audit_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(user_id) ON DELETE CASCADE,
    action VARCHAR(100),
    resource_type VARCHAR(50),
    resource_id UUID,
    timestamp TIMESTAMP DEFAULT NOW()
);

-- =============================================================================
-- END OF MIGRATION
-- =============================================================================
