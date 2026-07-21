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
// 1. PIPELINE BOARD: Fetch 21 Titles and Categorize
// -----------------------------------------------------------------------------
router.get('/pipeline', requireAuth, async (req, res) => {
    try {
        const { data: titles, error } = await supabase
            .from('title')
            .select('*, media_asset(*), rights_avails(*), title_document(*)');
            
        if (error) throw error;

        const columnsMap = {
            'imported': { id: 'imported', title: 'Imported', items: [] },
            'metadata_verified': { id: 'metadata_verified', title: 'Metadata Verified', items: [] },
            'assets_received': { id: 'assets_received', title: 'Assets Received', items: [] },
            'qc_passed': { id: 'qc_passed', title: 'QC Passed', items: [] },
            'rights_structured': { id: 'rights_structured', title: 'Rights Structured', items: [] },
            'docs_verified': { id: 'docs_verified', title: 'Docs Verified', items: [] },
            'sellable': { id: 'sellable', title: 'Sellable', items: [] }
        };

        for (const t of (titles || [])) {
            const hasVideo = t.media_asset && t.media_asset.some(a => a.asset_type === 'master_video');
            const hasRights = t.rights_avails && t.rights_avails.length > 0;
            const hasDocs = t.title_document && t.title_document.length > 0;

            if (!hasVideo) {
                columnsMap['imported'].items.push({ title: t.title_name, blocker: 'Missing Master Video' });
            } else if (!hasRights) {
                columnsMap['assets_received'].items.push({ title: t.title_name, blocker: 'Rights need structuring' });
            } else if (!hasDocs) {
                columnsMap['rights_structured'].items.push({ title: t.title_name, blocker: 'Missing Legal Documents' });
            } else {
                columnsMap['sellable'].items.push({ title: t.title_name, blocker: 'None' });
            }
        }

        return res.status(200).json({ columns: Object.values(columnsMap) });
    } catch (err) {
        return res.status(500).json({ error: err.message });
    }
});

// -----------------------------------------------------------------------------
// 2. RIGHTS AVAILS: Fetch Structured Rows
// -----------------------------------------------------------------------------
router.get('/titles/:id/rights', requireAuth, async (req, res) => {
    try {
        const { data: title, error: titleErr } = await supabase
            .from('title')
            .select('id')
            .eq('id', req.params.id)
            .maybeSingle();

        if (titleErr || !title) return res.status(404).json({ error: 'Title not found' });

        const { data, error } = await supabase
            .from('rights_avails')
            .select('*')
            .eq('title_id', req.params.id);
            
        if (error) throw error;
        
        const rightsGrid = (data || []).map(r => ({
            territory: r.territory_iso,
            platform: r.media_type,
            status: r.is_available ? 'Available' : 'Blocked'
        }));

        return res.status(200).json({ titleId: req.params.id, rightsGrid });
    } catch (err) {
        return res.status(500).json({ error: err.message });
    }
});

// -----------------------------------------------------------------------------
// 3. MESSAGE THREADS: Fetch Threads and Post Messages
// -----------------------------------------------------------------------------
router.get('/titles/:id/threads', requireAuth, async (req, res) => {
    try {
        const { data: threads, error } = await supabase
            .from('thread')
            .select('*, message(*)')
            .eq('title_id', req.params.id);
            
        if (error) throw error;
        
        // We also want buyer info, but for this mock we'll map it to a generic name
        const mappedThreads = (threads || []).map(t => ({
            id: t.id,
            buyer_name: 'Counterparty', // Ideally joined with party table
            subject: t.subject,
            last_activity: 'Just now',
            unread: false,
            messages: (t.message || []).map(m => ({
                sender: m.sender_party_id === req.user.party_id ? 'You' : 'Buyer',
                body: m.body,
                time: m.created_at,
                is_system: m.is_system_event
            }))
        }));
        
        return res.status(200).json({ threads: mappedThreads });
    } catch (err) {
        return res.status(500).json({ error: err.message });
    }
});

router.post('/threads/:id/messages', requireAuth, async (req, res) => {
    try {
        const { message, isSystemEvent } = req.body;
        
        if (!message || message.trim() === '') {
            return res.status(400).json({ error: 'Message body cannot be empty' });
        }

        const { data, error } = await supabase
            .from('message')
            .insert([{
                thread_id: req.params.id,
                sender_party_id: req.user.party_id,
                body: message,
                is_system_event: isSystemEvent || false
            }])
            .select()
            .single();
            
        if (error) throw error;
        
        return res.status(201).json({
            messageId: data.id,
            threadId: data.thread_id,
            message: data.body,
            createdAt: data.created_at
        });
    } catch (err) {
        return res.status(500).json({ error: err.message });
    }
});

module.exports = router;
