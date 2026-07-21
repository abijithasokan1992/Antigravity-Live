-- 1. IDENTITY & ROLES
CREATE TABLE IF NOT EXISTS party (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    is_organization BOOLEAN NOT NULL DEFAULT FALSE,
    legal_name VARCHAR(255) NOT NULL,
    display_name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    phone VARCHAR(50),
    metadata JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS party_role (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    party_id UUID NOT NULL REFERENCES party(id) ON DELETE CASCADE,
    role_type VARCHAR(50) NOT NULL, -- 'creator', 'studio', 'buyer', 'admin'
    organization_party_id UUID REFERENCES party(id),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    CONSTRAINT unique_party_role UNIQUE(party_id, role_type, organization_party_id)
);

CREATE TABLE IF NOT EXISTS auth_identity (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    party_id UUID NOT NULL REFERENCES party(id) ON DELETE CASCADE,
    provider VARCHAR(50) NOT NULL, -- 'email_link', 'password'
    identifier VARCHAR(255) NOT NULL,
    password_hash VARCHAR(255),
    last_login_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    CONSTRAINT unique_provider_identifier UNIQUE(provider, identifier)
);

-- 2. CATALOGUE & STORAGE
CREATE TABLE IF NOT EXISTS title (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    parent_title_id UUID REFERENCES title(id) ON DELETE CASCADE,
    owner_party_id UUID NOT NULL REFERENCES party(id),
    title_name VARCHAR(255) NOT NULL,
    type VARCHAR(50) NOT NULL, -- 'feature_film', 'tv_series', 'season', 'episode'
    synopsis TEXT,
    runtime_seconds INT,
    original_language VARCHAR(10),
    production_year INT,
    status VARCHAR(50) NOT NULL DEFAULT 'draft',
    draft_state JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS media_asset (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title_id UUID NOT NULL REFERENCES title(id) ON DELETE CASCADE,
    asset_type VARCHAR(50) NOT NULL, -- 'master_video', 'trailer', 'artwork', 'subtitle', 'screener'
    storage_provider VARCHAR(50) NOT NULL, -- 'aws_s3', 'oracle_cloud'
    bucket_name VARCHAR(255) NOT NULL,
    object_key TEXT NOT NULL,
    file_size_bytes BIGINT,
    container_format VARCHAR(50),
    technical_spec JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS title_document (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title_id UUID NOT NULL REFERENCES title(id) ON DELETE CASCADE,
    document_type VARCHAR(50) NOT NULL, -- 'chain_of_title', 'rights_certificate', 'censor_certificate', 'tech_spec'
    storage_provider VARCHAR(50) NOT NULL,
    bucket_name VARCHAR(255) NOT NULL,
    object_key TEXT NOT NULL,
    verification_status VARCHAR(50) NOT NULL DEFAULT 'pending', -- 'pending', 'verified', 'rejected'
    verified_by_party_id UUID REFERENCES party(id),
    verified_at TIMESTAMPTZ,
    notes TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 3. STRUCTURED RIGHTS & AVAILS
CREATE TABLE IF NOT EXISTS rights_avails (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title_id UUID NOT NULL REFERENCES title(id) ON DELETE CASCADE,
    territory_iso VARCHAR(3) NOT NULL, -- ISO 3166-1 alpha-3 (e.g. 'IND', 'USA', 'WLD')
    media_type VARCHAR(50) NOT NULL, -- 'satellite', 'svod', 'tvod', 'avod', 'theatrical', 'audio'
    is_exclusive BOOLEAN NOT NULL DEFAULT FALSE,
    window_start DATE NOT NULL,
    window_end DATE, -- NULL = Perpetual
    is_available BOOLEAN NOT NULL DEFAULT TRUE, -- FALSE = Holdback / Excluded
    minimum_guarantee_amount BIGINT DEFAULT 0, -- Minor units (e.g. Paise/Cents)
    currency VARCHAR(3) DEFAULT 'INR',
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 4. BROKERAGE, DEALS & COMMUNICATION
CREATE TABLE IF NOT EXISTS buyer_mapping (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title_id UUID NOT NULL REFERENCES title(id) ON DELETE CASCADE,
    buyer_party_id UUID NOT NULL REFERENCES party(id) ON DELETE CASCADE,
    mapped_by_party_id UUID NOT NULL REFERENCES party(id),
    status VARCHAR(50) NOT NULL DEFAULT 'active',
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    CONSTRAINT unique_title_buyer UNIQUE(title_id, buyer_party_id)
);

CREATE TABLE IF NOT EXISTS thread (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title_id UUID NOT NULL REFERENCES title(id) ON DELETE CASCADE,
    buyer_party_id UUID NOT NULL REFERENCES party(id) ON DELETE CASCADE,
    subject VARCHAR(255) NOT NULL,
    status VARCHAR(50) NOT NULL DEFAULT 'open',
    last_activity_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    CONSTRAINT unique_title_buyer_thread UNIQUE(title_id, buyer_party_id)
);

CREATE TABLE IF NOT EXISTS message (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    thread_id UUID NOT NULL REFERENCES thread(id) ON DELETE CASCADE,
    sender_party_id UUID NOT NULL REFERENCES party(id),
    body TEXT NOT NULL,
    message_type VARCHAR(50) NOT NULL DEFAULT 'user_message',
    email_message_id VARCHAR(255),
    attachment_asset_id UUID REFERENCES media_asset(id),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS deal (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title_id UUID NOT NULL REFERENCES title(id),
    buyer_party_id UUID NOT NULL REFERENCES party(id),
    seller_party_id UUID NOT NULL REFERENCES party(id),
    broker_party_id UUID REFERENCES party(id),
    deal_status VARCHAR(50) NOT NULL DEFAULT 'draft',
    total_agreed_amount BIGINT NOT NULL DEFAULT 0, -- Minor units (10000000 = ₹100,000.00)
    currency VARCHAR(3) NOT NULL DEFAULT 'INR',
    contract_document_id UUID REFERENCES title_document(id),
    executed_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS deal_rights_granted (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    deal_id UUID NOT NULL REFERENCES deal(id) ON DELETE CASCADE,
    rights_avail_id UUID NOT NULL REFERENCES rights_avails(id),
    granted_window_start DATE NOT NULL,
    granted_window_end DATE,
    is_exclusive BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
