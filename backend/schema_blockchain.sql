-- =============================================================================
-- schema_blockchain.sql
-- Blockchain Rights Registry Schema for StreamVista OS
-- Run once in Supabase SQL editor
-- =============================================================================

CREATE TABLE IF NOT EXISTS ledger_transactions (
    transaction_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    asset_id UUID REFERENCES projects(id) ON DELETE CASCADE,
    license_id UUID REFERENCES licenses(license_id) ON DELETE CASCADE, -- Nullable if just an asset registration
    
    transaction_type VARCHAR(50) NOT NULL, -- e.g., 'ASSET_MINT', 'LICENSE_EXECUTION', 'RIGHTS_TRANSFER'
    crypto_hash VARCHAR(256) UNIQUE NOT NULL, -- The SHA-256 hash or TxID on the blockchain
    
    block_timestamp TIMESTAMP DEFAULT NOW(),
    metadata JSONB, -- Stores the actual terms (Territory, Holdbacks) that were hashed
    
    network VARCHAR(50) DEFAULT 'STREAMVISTA_PRIVATE_LEDGER' -- E.g., 'POLYGON_MAINNET' in future
);

-- =============================================================================
-- END OF MIGRATION
-- =============================================================================
