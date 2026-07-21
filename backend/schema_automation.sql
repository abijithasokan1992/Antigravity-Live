-- =============================================================================
-- schema_automation.sql
-- Automation Engine Schema for StreamVista OS
-- Run once in Supabase SQL editor
-- =============================================================================

CREATE TABLE IF NOT EXISTS automation_rules (
    rule_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    rule_key VARCHAR(100) UNIQUE NOT NULL, -- e.g., 'AUTO_DISPATCH_ON_CLOSE'
    name VARCHAR(255) NOT NULL,
    description TEXT,
    is_active BOOLEAN DEFAULT false,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS automation_logs (
    log_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    rule_key VARCHAR(100) REFERENCES automation_rules(rule_key) ON DELETE CASCADE,
    action_taken TEXT NOT NULL, -- e.g., 'Triggered transcoding job #job-001'
    target_id UUID, -- References the deal or job ID affected
    status VARCHAR(50) DEFAULT 'SUCCESS', -- SUCCESS, FAILED
    timestamp TIMESTAMP DEFAULT NOW()
);

-- Seed basic rules
INSERT INTO automation_rules (rule_key, name, description, is_active)
VALUES 
    ('AUTO_DISPATCH_ON_CLOSE', 'Auto-Fulfillment on Deal Close', 'Automatically queues a transcoding and packaging job in the Distribution Hub when a deal is marked CLOSED WON.', true),
    ('AUTO_CREATE_LEAD', 'Auto-Create CRM Lead', 'Automatically creates a Buyer CRM lead when an email is received from an enterprise domain.', true),
    ('AUTO_SCREENER_DELIVERY', 'Auto-Deliver Screener', 'Automatically replies with a secure proxy screener if a high-scoring lead requests review.', false)
ON CONFLICT (rule_key) DO NOTHING;

-- =============================================================================
-- END OF MIGRATION
-- =============================================================================
