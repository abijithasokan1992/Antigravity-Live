// seed_publish.js
// Simple script to publish a demo title into Supabase for the StreamVista v3 backend
require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');
const SUPABASE_URL = process.env.SUPABASE_URL || 'https://mock.supabase.co';
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_KEY || 'mock-key';
const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY);

(async () => {
  try {
    // Insert a title with status 'published'
    const { data: title, error: titleErr } = await supabase.from('title').insert({
      owner_party_id: 1,
      title_name: 'Inception (Demo)',
      type: 'feature_film',
      status: 'published',
      runtime_seconds: 8880,
      original_language: 'EN',
      production_year: 2010
    }).select().single();
    if (titleErr) throw titleErr;

    console.log('Inserted title:', title);

    // Insert a media asset placeholder (master video)
    const { data: asset, error: assetErr } = await supabase.from('media_asset').insert({
      title_id: title.id,
      asset_type: 'master_video',
      storage_provider: 'local',
      bucket_name: 'demo',
      object_key: 'inception_demo.mp4',
      file_size_bytes: 0,
      technical_spec: {}
    }).select().single();
    if (assetErr) throw assetErr;
    console.log('Inserted media_asset:', asset);

    // Insert a rights_avail entry indicating it's available globally
    const { data: avail, error: availErr } = await supabase.from('rights_avails').insert({
      title_id: title.id,
      territory_iso: 'WORLD',
      media_type: 'stream',
      is_available: true
    }).select().single();
    if (availErr) throw availErr;
    console.log('Inserted rights_avail:', avail);

    console.log('Demo title published successfully.');
  } catch (e) {
    console.error('Error publishing demo title:', e);
    process.exit(1);
  }
})();
