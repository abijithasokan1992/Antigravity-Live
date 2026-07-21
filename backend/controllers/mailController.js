/**
 * controllers/mailController.js
 * 
 * Handles incoming requests from the Mail Center CRM Dashboard.
 */

const hostingerMail = require('../services/hostingerMail');
const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
    process.env.SUPABASE_URL || 'https://mock.supabase.co',
    process.env.SUPABASE_SERVICE_ROLE_KEY || 'mock-key'
);

class MailController {
    
    /**
     * Triggered by the frontend or a cron job to sync recent emails from Hostinger
     * into the StreamVista Supabase CRM.
     */
    async syncInbox(req, res) {
        try {
            // 1. Connect & Fetch from IMAP
            await hostingerMail.connect(req.user.email, 'mock-password');
            const newEmails = await hostingerMail.fetchInbox(10);
            
            // 2. Upsert into CRM Database
            // For this mock, we just return the fetched emails.
            // In reality we would insert these into `email_threads` and `emails`.
            
            return res.status(200).json({
                success: true,
                message: `Synced ${newEmails.length} new emails.`,
                emails: newEmails
            });
        } catch (err) {
            console.error('[MailController] Sync Error:', err);
            return res.status(500).json({ success: false, error: err.message });
        }
    }

    /**
     * Dispatch an outbound email (e.g., a licensing screener link)
     */
    async sendEmail(req, res) {
        try {
            const { to, subject, body_html, thread_id } = req.body;
            
            if (!to || !subject || !body_html) {
                return res.status(400).json({ success: false, error: 'Missing required fields' });
            }

            // 1. Send via SMTP
            await hostingerMail.sendEmail(to, subject, body_html);

            // 2. Log outbound email to CRM database
            await supabase.from('emails').insert({
                thread_id: thread_id || null, // Will create new thread logic in Phase 2
                sender_email: req.user.email,
                recipient_email: to,
                body_html: body_html,
                direction: 'OUTBOUND',
                sent_at: new Date().toISOString()
            });

            return res.status(200).json({ success: true, message: 'Email dispatched successfully.' });
        } catch (err) {
            console.error('[MailController] Send Error:', err);
            return res.status(500).json({ success: false, error: err.message });
        }
    }
}

module.exports = new MailController();
