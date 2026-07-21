const express = require('express');
const router = express.Router();
const { createClient } = require('@supabase/supabase-js');

// Initialize Supabase Client
const supabaseUrl = process.env.SUPABASE_URL || 'https://mock.supabase.co';
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || 'mock-key';
const supabase = createClient(supabaseUrl, supabaseKey);

// Enforced Legal Notice Clause
const NON_SUBLICENSABLE_CLAUSE = 
  "LEGAL NOTICE: All licenses, rights, and digital distribution agreements granted by StreamVista / Crayons Network are strictly Non-Sublicensable with 'No Right to Deliver to Next Person'.";

/**
 * POST /api/v1/support/chat
 * Automated support assistant endpoint for catalog licensing & creator payout checks.
 */
router.post('/api/v1/support/chat', async (req, res) => {
  try {
    const { query_type, entity_id, keyword, prompt } = req.body;

    if (!query_type) {
      return res.status(400).json({ 
        success: false, 
        error: "Missing required field: 'query_type' must be 'licensing', 'payout', or 'general'." 
      });
    }

    let responseData = {};
    let botMessage = "";

    switch (query_type.toLowerCase()) {

      // -------------------------------------------------------------
      // 1. LICENSING & CATALOG AVAILS INQUIRIES
      // -------------------------------------------------------------
      case 'licensing': {
        const searchTerm = keyword || prompt || '';
        
        if (!searchTerm.trim()) {
          botMessage = "Please provide a movie or title name to check rights and territory availability in the Crayons Network catalog.";
          break;
        }

        // Query title and rights_avails tables for matches (schema-corrected)
        const { data: titles, error: titleErr } = await supabase
          .from('title')
          .select(`
            id, 
            title_name, 
            status,
            rights_avails ( territory_iso, media_type, is_available )
          `)
          .ilike('title_name', `%${searchTerm.trim()}%`)
          .limit(5);

        if (titleErr) throw titleErr;

        if (!titles || titles.length === 0) {
          botMessage = `No distribution titles matching "${searchTerm}" were found in our current catalog.`;
        } else {
          const listFormatted = titles.map(t => {
            const activeAvails = t.rights_avails ? t.rights_avails.filter(a => a.is_available) : [];
            const rights = activeAvails.length > 0 ? Array.from(new Set(activeAvails.map(a => a.media_type))).join(', ') : 'N/A';
            const territories = activeAvails.length > 0 ? Array.from(new Set(activeAvails.map(a => a.territory_iso))).join(', ') : 'Global';
            return `• **${t.title_name}** | Rights: [${rights}] | Territories: [${territories}] | Status: ${t.status}`;
          }).join('\n');

          botMessage = `Found ${titles.length} matching title(s) in the Crayons Network catalog:\n\n${listFormatted}`;
        }

        responseData = { catalog_matches: titles || [] };
        break;
      }

      // -------------------------------------------------------------
      // 2. PAYOUT & FINANCIAL LEDGER STATUS INQUIRIES
      // -------------------------------------------------------------
      case 'payout': {
        if (!entity_id) {
          return res.status(400).json({ 
            success: false, 
            error: "Parameter 'entity_id' is required to fetch financial ledger statements." 
          });
        }

        // Fetch recent ledger statements. Schema correction: entity_id checks against title's owner_party_id.
        // We'll fetch the ledger directly matching the channel_party_id or just returning the ledger.
        // For simplicity and matching the user's intent, assuming entity_id maps to channel_party_id or title owner.
        // Let's use creator_balance_summary for the clearest picture:
        const { data: balance, error: balanceErr } = await supabase
          .from('creator_balance_summary')
          .select('*')
          .eq('creator_party_id', entity_id)
          .maybeSingle();

        if (balanceErr) throw balanceErr;

        if (!balance) {
          botMessage = `No recent financial statement entries found for entity ID: ${entity_id}.`;
        } else {
          botMessage = `Your current financial summary:\nTotal Earned: INR ${balance.total_earned}\nAvailable Balance: INR ${balance.available_balance}\nPaid Out: INR ${balance.total_paid_out}`;
        }

        responseData = { balance_summary: balance || {} };
        break;
      }

      // -------------------------------------------------------------
      // 3. GENERAL / FALLBACK ASSISTANT RESPONSES
      // -------------------------------------------------------------
      default: {
        botMessage = "Welcome to StreamVista Support! For catalog availability, specify 'query_type': 'licensing' along with the title keyword. For payout updates, specify 'query_type': 'payout' with your 'entity_id'.";
        break;
      }
    }

    // Always attach the strict non-sublicensable legal disclaimer
    return res.status(200).json({
      success: true,
      query_type,
      message: botMessage,
      data: responseData,
      compliance_disclaimer: NON_SUBLICENSABLE_CLAUSE,
      timestamp: new Date().toISOString()
    });

  } catch (err) {
    console.error("[Support Assistant API Error]:", err);
    return res.status(500).json({
      success: false,
      error: "An error occurred while querying the support knowledge base.",
      details: err.message
    });
  }
});

module.exports = router;
