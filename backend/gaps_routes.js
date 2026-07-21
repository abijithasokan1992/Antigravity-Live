const express = require('express');
const router = express.Router();
const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  process.env.SUPABASE_URL || 'https://mock.supabase.co',
  process.env.SUPABASE_SERVICE_ROLE_KEY || 'mock-key',
);

const requireAuth = (req, res, next) => {
    const auth = req.headers.authorization;
    if (!auth) return res.status(401).json({ error: 'Unauthorized' });
    req.user = { party_id: 'creator-party-id' }; // Mocked for preview
    next();
};

// -----------------------------------------------------------------------------
// 1. DELIVERABLES EXPORTER: Generate Channel-Specific Delivery ZIP Manifest
// -----------------------------------------------------------------------------
router.post('/api/v1/deliveries/package', requireAuth, async (req, res) => {
    const { title_id, channel_name, target_spec_preset } = req.body;

    try {
        // Fetch Master Video, Subtitles, Censor, and Metadata
        const { data: title, error: titleErr } = await supabase
            .from('title')
            .select('*, media_asset(*)')
            .eq('id', title_id)
            .single();

        if (titleErr || !title) return res.status(404).json({ error: 'Title assets not found' });

        const sku = `SKU_${title.id.slice(0, 8).toUpperCase()}_${channel_name.toUpperCase()}`;
        
        // Build Metadata CSV Payload matching Filmhub standard structure
        const metadataCsv = `SKU,Title,Format,Censor_Rating,Language,Aspect_Ratio,Audio_Format,License_Notice
${sku},"${title.title_name}","Movie","${title.censor_rating || 'U'}","Malayalam","1.85:1","5.1 Surround","NON-SUBLICENSABLE - NO RIGHT TO DELIVER TO NEXT PERSON"`;

        // Simulate Async S3 ZIP Packaging Trigger
        const mockS3BundleUrl = `https://streamvista-masters.s3.amazonaws.com/deliveries/${sku}_bundle.zip`;

        const { data: manifest, error: manifestErr } = await supabase
            .from('delivery_manifest')
            .insert([{
                title_id,
                channel_name,
                target_spec_preset,
                manifest_sku: sku,
                bundle_s3_url: mockS3BundleUrl,
                status: 'ready'
            }])
            .select()
            .single();

        if (manifestErr) throw manifestErr;

        return res.status(201).json({
            message: 'Delivery package generated successfully',
            manifest,
            csv_preview: metadataCsv
        });
    } catch (err) {
        return res.status(500).json({ error: err.message });
    }
});

// -----------------------------------------------------------------------------
// 1.5. DELIVERIES: Fetch Manifest Status (For Polling)
// -----------------------------------------------------------------------------
router.get('/api/v1/deliveries/manifest/:id', requireAuth, async (req, res) => {
    const { id } = req.params;
    const { data, error } = await supabase
        .from('delivery_manifest')
        .select('*')
        .eq('id', id)
        .single();
        
    if (error) return res.status(500).json({ error: error.message });
    return res.status(200).json(data);
});

// -----------------------------------------------------------------------------
// 2. STATEMENTS & PAYOUT: Fetch Ledger & Request Withdrawal
// -----------------------------------------------------------------------------
router.get('/api/v1/financials/ledger/:title_id', requireAuth, async (req, res) => {
    const { title_id } = req.params;
    const { data, error } = await supabase
        .from('financial_ledger')
        .select('*')
        .eq('title_id', title_id)
        .order('reporting_period_end', { ascending: false });

    if (error) return res.status(500).json({ error: error.message });
    return res.status(200).json({ ledger: data });
});

router.get('/api/v1/financials/balance/:creator_party_id', requireAuth, async (req, res) => {
    const { creator_party_id } = req.params;
    if (req.user.party_id !== creator_party_id) {
        return res.status(403).json({ error: 'Forbidden: Cannot access other users balance' });
    }
    
    const { data, error } = await supabase
        .from('creator_balance_summary')
        .select('*')
        .eq('creator_party_id', creator_party_id)
        .single();

    if (error) return res.status(500).json({ error: error.message });
    return res.status(200).json(data);
});

router.post('/api/v1/financials/request-payout', requireAuth, async (req, res) => {
  try {
    const { party_id, ledger_ids } = req.body;

    if (!party_id) {
      return res.status(400).json({
        success: false,
        error: 'party_id is required to request payout.'
      });
    }

    // Build query to target specific ledgers OR all payable ledgers for the party
    let query = supabase
      .from('financial_ledger')
      .update({
        statement_status: 'payout_requested',
        updated_at: new Date().toISOString()
      })
      .eq('party_id', party_id);

    if (Array.isArray(ledger_ids) && ledger_ids.length > 0) {
      query = query.in('id', ledger_ids);
    } else {
      query = query.eq('statement_status', 'reconciled');
    }

    const { data, error } = await query.select();

    if (error) {
      console.error('Supabase query error on payout request:', error);
      return res.status(500).json({ success: false, error: error.message });
    }

    if (!data || data.length === 0) {
      return res.status(404).json({
        success: false,
        error: 'No eligible ledger records found for payout request.'
      });
    }

    return res.status(200).json({
      success: true,
      message: `Payout requested for ${data.length} ledger statement(s).`,
      records_updated: data.length,
      updated_ledgers: data
    });
  } catch (err) {
    console.error('Unhandled server exception in request-payout:', err);
    return res.status(500).json({ success: false, error: 'Internal server error.' });
  }
});

module.exports = router;
