// routes/blockchain_routes.js
const express = require('express');
const router = express.Router();
const BlockchainRegistry = require('./services/blockchainRegistry');
const { createClient } = require('@supabase/supabase-js');
const supabase = createClient(
  process.env.SUPABASE_URL || 'https://mock.supabase.co',
  process.env.SUPABASE_SERVICE_KEY || 'mock-key'
);

/**
 * POST /api/v1/blockchain/mint
 * Mints an asset to the secure rights ledger and records it.
 */
router.post('/api/v1/blockchain/mint', async (req, res) => {
  try {
    const { projectId, projectName, ownerEmail } = req.body;
    if (!projectId || !projectName || !ownerEmail) {
      return res.status(400).json({ success: false, error: 'Missing required fields' });
    }
    const tx = await BlockchainRegistry.mintAsset(projectId, projectName, ownerEmail);
    // Persist to ledger_transactions table
    const { data, error } = await supabase.from('ledger_transactions').insert({
      asset_id: projectId,
      transaction_type: tx.transactionType,
      crypto_hash: tx.hash,
    }).select();
    if (error) {
      console.error('Supabase insert error:', error);
      return res.status(500).json({ success: false, error: 'Failed to record ledger entry' });
    }
    return res.status(200).json({ ...tx, ledger: data[0] });
  } catch (err) {
    console.error('[Blockchain Route Error]:', err);
    return res.status(500).json({ success: false, error: err.message });
  }
});

/**
 * GET /api/v1/blockchain/ledger
 * Retrieves all ledger entries.
 */
router.get('/api/v1/blockchain/ledger', async (req, res) => {
  try {
    const { data, error } = await supabase.from('ledger_transactions').select();
    if (error) {
      console.error('Supabase fetch error:', error);
      return res.status(500).json({ success: false, error: 'Failed to fetch ledger' });
    }
    return res.status(200).json({ success: true, ledger: data });
  } catch (err) {
    console.error('[Blockchain Route Error]:', err);
    return res.status(500).json({ success: false, error: err.message });
  }
});

module.exports = router;
