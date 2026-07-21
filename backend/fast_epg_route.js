// routes/fast_epg_route.js
const express = require('express');
const router = express.Router();
const { createClient } = require('@supabase/supabase-js');
const builder = require('xmlbuilder');

const supabase = createClient(
  process.env.SUPABASE_URL || 'https://mock.supabase.co', 
  process.env.SUPABASE_SERVICE_ROLE_KEY || 'mock-key'
);

/**
 * GET /api/v1/fast/epg.xml
 * Returns standardized XMLTV feed for Samsung TV Plus, LG Channels, etc.
 */
router.get('/api/v1/fast/epg.xml', async (req, res) => {
  try {
    const { data: schedule, error } = await supabase
      .from('fast_schedules')
      .select('id, start_time, end_time, title, description, category, poster_url')
      .gte('start_time', new Date(Date.now() - 6 * 3600 * 1000).toISOString()) // Past 6h
      .lte('end_time', new Date(Date.now() + 48 * 3600 * 1000).toISOString())   // Next 48h
      .order('start_time', { ascending: true });

    if (error) throw error;

    const xml = builder.create('tv', { version: '1.0', encoding: 'UTF-8' })
      .att('generator-info-name', 'Crayons Loop FAST Generator');

    // Channel declaration
    xml.ele('channel', { id: 'crayons-loop-malayalam' })
      .ele('display-name', 'Crayons Loop Malayalam').up()
      .ele('icon', { src: 'https://crayonsloop.com/assets/logo.png' });

    // Programme schedule entries
    if (schedule && schedule.length > 0) {
      schedule.forEach(item => {
        const formatTime = (isoStr) => new Date(isoStr).toISOString().replace(/[-:]/g, '').split('.')[0] + ' +0000';

        const prog = xml.ele('programme', {
          start: formatTime(item.start_time),
          stop: formatTime(item.end_time),
          channel: 'crayons-loop-malayalam'
        });

        prog.ele('title', { lang: 'ml' }, item.title);
        prog.ele('desc', { lang: 'en' }, item.description);
        prog.ele('category', { lang: 'en' }, item.category || 'Movie');
        if (item.poster_url) {
          prog.ele('icon', { src: item.poster_url });
        }
      });
    }

    res.header('Content-Type', 'application/xml');
    return res.status(200).send(xml.end({ pretty: true }));
  } catch (err) {
    console.error('[EPG XML Generation Error]:', err);
    return res.status(500).send('<error>Failed to generate EPG</error>');
  }
});

module.exports = router;
