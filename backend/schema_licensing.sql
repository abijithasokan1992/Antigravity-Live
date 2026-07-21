-- =============================================================================
-- schema_licensing.sql
-- Licensing CRM Schema for StreamVista OS
-- Run once in Supabase SQL editor
-- =============================================================================

-- Ensure CRM schema exists
-- We assume `buyers` and `projects` tables already exist from previous migrations

CREATE TABLE IF NOT EXISTS licenses (
    license_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    buyer_id UUID REFERENCES buyers(buyer_id) ON DELETE CASCADE,
    project_id UUID REFERENCES projects(id) ON DELETE CASCADE,
    
    territory VARCHAR(100), -- e.g., 'INDIA', 'GLOBAL', 'NORTH_AMERICA'
    rights_type VARCHAR(50), -- e.g., 'SVOD', 'AVOD', 'TV_PAY', 'THEATRICAL'
    
    is_exclusive BOOLEAN DEFAULT true,
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    
    license_fee DECIMAL(12, 2),
    status VARCHAR(50) DEFAULT 'ACTIVE', -- ACTIVE, EXPIRED, TERMINATED
    created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS holdbacks (
    holdback_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    license_id UUID REFERENCES licenses(license_id) ON DELETE CASCADE,
    project_id UUID REFERENCES projects(id) ON DELETE CASCADE,
    
    restricted_rights_type VARCHAR(50), -- e.g., 'AVOD' cannot be sold during SVOD window
    restricted_territory VARCHAR(100),
    
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    
    created_at TIMESTAMP DEFAULT NOW()
);

-- =============================================================================
-- END OF MIGRATION
-- =============================================================================
