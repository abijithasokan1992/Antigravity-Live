// routes/distribution_routes.js
const express = require('express');
const router = express.Router();
const DistributionEngine = require('./services/distributionEngine');

/**
 * POST /api/v1/distribution/dispatch
 * Triggers a new transcoding and delivery job for a closed licensing deal.
 */
router.post('/api/v1/distribution/dispatch', async (req, res) => {
  try {
    const { dealName, formatPreset } = req.body;

    if (!dealName || !formatPreset) {
      return res.status(400).json({ success: false, error: 'Missing dealName or formatPreset' });
    }

    const job = await DistributionEngine.triggerDelivery(dealName, formatPreset);
    
    return res.status(200).json(job);
  } catch (err) {
    console.error('[Distribution Route Error]:', err);
    return res.status(500).json({ success: false, error: err.message });
  }
});

module.exports = router;
