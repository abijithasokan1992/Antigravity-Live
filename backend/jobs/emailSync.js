/**
 * jobs/emailSync.js
 * 
 * Background Cron Job that polls the Hostinger INBOX every 5 minutes.
 */

const mailSyncService = require('../services/mailSync');

// In production, we would use node-cron:
// const cron = require('node-cron');

class EmailSyncJob {
    start() {
        console.log('[Cron] Initializing Email Sync Job (runs every 5 minutes)');
        
        // Mocking the setInterval for the purpose of the architecture
        setInterval(async () => {
            console.log('[Cron] Executing Scheduled Mail Sync...');
            try {
                // We use the Master account for the CRM
                const accountEmail = 'abijithasokan@crayonspictures.com';
                const accountPassword = process.env.HOSTINGER_PASSWORD || 'mock-password';

                await mailSyncService.executeSync(accountEmail, accountPassword);
            } catch (err) {
                console.error('[Cron] Email Sync Failed:', err.message);
            }
        }, 5 * 60 * 1000); // 5 minutes
    }
}

module.exports = new EmailSyncJob();
