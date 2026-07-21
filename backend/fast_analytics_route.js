// routes/fast_analytics_route.js
const express = require('express');
const router = express.Router();
const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  process.env.SUPABASE_URL || 'https://mock.supabase.co', 
  process.env.SUPABASE_SERVICE_ROLE_KEY || 'mock-key'
);

/**
 * GET /api/v1/fast/analytics/realtime
 * Fetch real-time concurrent viewers (CCV) and active stream metrics.
 */
router.get('/api/v1/fast/analytics/realtime', async (req, res) => {
  try {
    // In a real system, we'd query `fast_viewer_sessions` where `last_ping_at` > NOW() - 30 seconds
    // For this mock FAST telemetry backend, we will generate realistic simulated metrics.
    
    return res.status(200).json({
      success: true,
      metrics: {
        concurrent_viewers: 14205,
        buffer_ratio_pct: 0.8,
        active_regions: ['IN', 'US', 'AE', 'UK'],
        ad_fill_rate_pct: 94.2,
        estimated_revenue_usd: 1245.50
      }
    });
  } catch (err) {
    console.error('[FAST Analytics Error]:', err);
    return res.status(500).json({ success: false, error: err.message });
  }
});

/**
 * GET /api/v1/fast/analytics/historical
 * Fetch audience retention graph data.
 */
router.get('/api/v1/fast/analytics/historical', async (req, res) => {
    try {
      // Mocked 24-hour retention graph points
      const chartPoints = Array.from({ length: 24 }).map((_, i) => {
          return {
              hour: i,
              viewers: Math.floor(Math.random() * (15000 - 5000 + 1)) + 5000,
              ad_impressions: Math.floor(Math.random() * (45000 - 15000 + 1)) + 15000,
          };
      });
  
      return res.status(200).json({
        success: true,
        data: chartPoints
      });
    } catch (err) {
      console.error('[FAST Analytics Error]:', err);
      return res.status(500).json({ success: false, error: err.message });
    }
  });

module.exports = router;
