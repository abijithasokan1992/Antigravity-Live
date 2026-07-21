// routes/ai_routes.js
const express = require('express');
const router = express.Router();
const AIScorerService = require('./services/ai_scorer');

/**
 * POST /api/v1/ai/score-lead
 * Analyzes an incoming email and drafts a response.
 */
router.post('/api/v1/ai/score-lead', async (req, res) => {
  try {
    const { senderDomain, emailBody, senderName } = req.body;

    if (!senderDomain || !emailBody) {
      return res.status(400).json({ success: false, error: 'Missing required fields' });
    }

    // Run the AI Lead analysis
    const analysis = await AIScorerService.analyzeLead(senderDomain, emailBody);
    
    // Generate a draft reply based on the analysis
    const draftReply = await AIScorerService.draftReply(senderName || 'Partner', analysis.intent);

    return res.status(200).json({
      success: true,
      analysis,
      draftReply
    });
  } catch (err) {
    console.error('[AI Scorer Error]:', err);
    return res.status(500).json({ success: false, error: err.message });
  }
});

module.exports = router;
