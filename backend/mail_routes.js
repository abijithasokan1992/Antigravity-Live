const express = require('express');
const router = express.Router();
const mailController = require('./controllers/mailController');

// Middleware to mock RBAC user for the Mail Center (Admin/Sales Team)
const requireMailAccess = async (req, res, next) => {
    const token = req.headers.authorization;
    if (!token) return res.status(401).json({ error: 'Unauthorized' });
    
    // Inject the real Hostinger email provided by the user for testing
    req.user = { 
        id: 'admin-user-id', 
        email: 'abijithasokan@crayonspictures.com',
        role: 'SUPER_ADMIN'
    };
    next();
};

/**
 * GET /api/v1/mail/sync
 * Polls Hostinger IMAP and syncs new threads into the CRM database.
 */
router.get('/api/v1/mail/sync', requireMailAccess, mailController.syncInbox.bind(mailController));

/**
 * POST /api/v1/mail/send
 * Dispatches an outbound email via Hostinger SMTP and logs it to the CRM.
 */
router.post('/api/v1/mail/send', requireMailAccess, mailController.sendEmail.bind(mailController));

module.exports = router;
