'use strict';

const express = require('express');
const { createClient } = require('@supabase/supabase-js');

const router = express.Router();

// ─────────────────────────────────────────────────────────────────────────────
// Client
// ─────────────────────────────────────────────────────────────────────────────

const supabase = createClient(
  process.env.SUPABASE_URL || 'https://mock.supabase.co',
  process.env.SUPABASE_SERVICE_ROLE_KEY || 'mock-key',
);

// ─────────────────────────────────────────────────────────────────────────────
// Auth middleware
// ─────────────────────────────────────────────────────────────────────────────

async function requireAuth(req, res, next) {
  const token = (req.headers.authorization || '').replace('Bearer ', '').trim();
  if (!token) return res.status(401).json({ error: 'Missing auth token' });

  const { data: { user }, error } = await supabase.auth.getUser(token);
  if (error || !user) return res.status(401).json({ error: 'Invalid token' });

  req.user = user;
  next();
}

// Resolve the party row for the authenticated user
async function resolveParty(userId) {
  const { data } = await supabase
    .from('auth_identity')
    .select('party_id')
    .eq('provider_user_id', userId)
    .single();
  return data?.party_id ?? null;
}

// ─────────────────────────────────────────────────────────────────────────────
// Validation helper
// ─────────────────────────────────────────────────────────────────────────────

const BOOLEAN_FLAGS = [
  'master_audio_sync_ok',
  'master_aspect_ratio_ok',
  'master_no_burned_slates',
  'master_correct_duration',
  'subtitles_timing_ok',
  'artwork_metadata_complete',
  'censor_certificate_verified',
];

const ALLOWED_STATUSES = ['in_progress', 'approved', 'rejected'];

function extractChecklistFields(body) {
  const fields = {};
  for (const flag of BOOLEAN_FLAGS) {
    if (typeof body[flag] === 'boolean') fields[flag] = body[flag];
  }
  if (typeof body.notes === 'string') fields.notes = body.notes.slice(0, 4000);
  if (ALLOWED_STATUSES.includes(body.status)) fields.status = body.status;
  return fields;
}

// ─────────────────────────────────────────────────────────────────────────────
// POST /api/qc/checklist
// Body: { title_id, ...flags, notes, status? }
// Returns: the created qc_operator_checklist row
// ─────────────────────────────────────────────────────────────────────────────

router.post('/', requireAuth, async (req, res) => {
  const { title_id } = req.body;
  if (!title_id) return res.status(400).json({ error: 'title_id is required' });

  const partyId = await resolveParty(req.user.id);
  if (!partyId) return res.status(403).json({ error: 'Operator party not found' });

  // Confirm title exists
  const { data: title, error: titleErr } = await supabase
    .from('title')
    .select('id')
    .eq('id', title_id)
    .single();

  if (titleErr || !title) return res.status(404).json({ error: 'Title not found' });

  const fields = extractChecklistFields(req.body);

  const payload = {
    title_id,
    operator_party_id: partyId,
    status: fields.status || 'in_progress',
    notes: fields.notes || null,
    ...BOOLEAN_FLAGS.reduce((acc, f) => {
      acc[f] = fields[f] ?? false;
      return acc;
    }, {}),
    created_at: new Date().toISOString(),
  };

  const { data, error } = await supabase
    .from('qc_operator_checklist')
    .insert(payload)
    .select()
    .single();

  if (error) {
    console.error('[qc/POST]', error);
    return res.status(500).json({ error: 'Failed to create QC record', detail: error.message });
  }

  // If immediately approved/rejected on creation, update title status
  if (data.status === 'approved' || data.status === 'rejected') {
    await _syncTitleStatus(title_id, data.status);
  }

  return res.status(201).json(data);
});

// ─────────────────────────────────────────────────────────────────────────────
// PUT /api/qc/checklist/:id
// Body: { ...flags, notes, status }
// Returns: the updated qc_operator_checklist row
// ─────────────────────────────────────────────────────────────────────────────

router.put('/:id', requireAuth, async (req, res) => {
  const { id } = req.params;

  // Fetch existing record to verify ownership
  const { data: existing, error: fetchErr } = await supabase
    .from('qc_operator_checklist')
    .select('id, title_id, operator_party_id, status')
    .eq('id', id)
    .single();

  if (fetchErr || !existing) return res.status(404).json({ error: 'QC record not found' });

  // Prevent re-opening a finalised QC
  if (existing.status === 'approved' || existing.status === 'rejected') {
    return res.status(409).json({
      error: 'QC record already finalised',
      current_status: existing.status,
    });
  }

  const fields = extractChecklistFields(req.body);
  if (!Object.keys(fields).length) {
    return res.status(400).json({ error: 'No valid fields to update' });
  }

  const patch = { ...fields };

  // Set completed_at when finalising
  if (patch.status === 'approved' || patch.status === 'rejected') {
    patch.completed_at = new Date().toISOString();
  }

  const { data, error } = await supabase
    .from('qc_operator_checklist')
    .update(patch)
    .eq('id', id)
    .select()
    .single();

  if (error) {
    console.error('[qc/PUT]', error);
    return res.status(500).json({ error: 'Failed to update QC record', detail: error.message });
  }

  // Keep title.status in sync
  if (data.status === 'approved' || data.status === 'rejected') {
    await _syncTitleStatus(existing.title_id, data.status);
  }

  return res.json(data);
});

// ─────────────────────────────────────────────────────────────────────────────
// GET /api/qc/checklist/:titleId
// Returns: the most recent QC checklist for a title
// ─────────────────────────────────────────────────────────────────────────────

router.get('/:titleId', requireAuth, async (req, res) => {
  const { titleId } = req.params;

  const { data, error } = await supabase
    .from('qc_operator_checklist')
    .select('*')
    .eq('title_id', titleId)
    .order('created_at', { ascending: false })
    .limit(1)
    .maybeSingle();

  if (error) {
    console.error('[qc/GET]', error);
    return res.status(500).json({ error: 'Failed to fetch QC record', detail: error.message });
  }

  if (!data) return res.status(404).json({ error: 'No QC record found for this title' });
  return res.json(data);
});

// ─────────────────────────────────────────────────────────────────────────────
// GET /api/qc/checklist/history/:titleId
// Returns: all QC records for a title (audit trail)
// ─────────────────────────────────────────────────────────────────────────────

router.get('/history/:titleId', requireAuth, async (req, res) => {
  const { titleId } = req.params;

  const { data, error } = await supabase
    .from('qc_operator_checklist')
    .select('*')
    .eq('title_id', titleId)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('[qc/history]', error);
    return res.status(500).json({ error: 'Failed to fetch QC history', detail: error.message });
  }

  return res.json({ records: data, count: data.length });
});

// ─────────────────────────────────────────────────────────────────────────────
// Internal helper: sync title.status after QC decision
// ─────────────────────────────────────────────────────────────────────────────

async function _syncTitleStatus(titleId, qcStatus) {
  const newTitleStatus = qcStatus === 'approved' ? 'qc_passed' : 'qc_rejected';
  await supabase
    .from('title')
    .update({ status: newTitleStatus })
    .eq('id', titleId)
    .catch((err) => console.error('[qc/_syncTitleStatus]', err));
}

module.exports = router;
