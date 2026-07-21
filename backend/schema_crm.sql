-- =============================================================================
-- schema_crm.sql
-- Mail Center CRM Schema for StreamVista OS
-- Run once in Supabase SQL editor
-- =============================================================================

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. CRM Entities
CREATE TABLE IF NOT EXISTS buyers (
    buyer_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    organization_name VARCHAR(255),
    buyer_type VARCHAR(50), -- e.g., 'BROADCASTER', 'OTT', 'IPTV'
    status VARCHAR(50) DEFAULT 'LEAD',
    created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS contacts (
    contact_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    buyer_id UUID REFERENCES buyers(buyer_id) ON DELETE CASCADE,
    full_name VARCHAR(255),
    email VARCHAR(255) UNIQUE,
    phone_number VARCHAR(50),
    title VARCHAR(100), -- e.g., 'Head of Acquisition'
    created_at TIMESTAMP DEFAULT NOW()
);

-- 2. Mail Center Tables
CREATE TABLE IF NOT EXISTS email_threads (
    thread_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    buyer_id UUID REFERENCES buyers(buyer_id) ON DELETE SET NULL,
    subject TEXT,
    status VARCHAR(50) DEFAULT 'OPEN', -- OPEN, ARCHIVED, NEGOTIATING
    created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS emails (
    email_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    thread_id UUID REFERENCES email_threads(thread_id) ON DELETE CASCADE,
    sender_email VARCHAR(255),
    recipient_email VARCHAR(255),
    body_html TEXT,
    body_text TEXT,
    message_id VARCHAR(255) UNIQUE, -- From IMAP headers
    sent_at TIMESTAMP,
    direction VARCHAR(20) -- 'INBOUND' or 'OUTBOUND'
);

-- Note: We rely on the core `users` and `organizations` tables (from Creator Cloud Sprint 1) 
-- to represent the internal StreamVista team members operating this Mail Center.

-- =============================================================================
-- END OF MIGRATION
-- =============================================================================
