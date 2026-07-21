/**
 * services/mailSync.js
 * 
 * Orchestrator for reading emails from Hostinger and inserting them 
 * safely into the Supabase CRM with intelligent extraction.
 */

const { createClient } = require('@supabase/supabase-js');
const hostingerMail = require('./hostingerMail');
const crmExtractor = require('./crmExtractor');

const supabase = createClient(
    process.env.SUPABASE_URL || 'https://mock.supabase.co',
    process.env.SUPABASE_SERVICE_ROLE_KEY || 'mock-key'
);

class MailSyncService {
    
    /**
     * Executes a full sync loop against the configured Hostinger inbox.
     * @param {string} accountEmail 
     * @param {string} accountPassword 
     */
    async executeSync(accountEmail, accountPassword) {
        console.log(`[MailSync] Starting sync for ${accountEmail}...`);
        
        await hostingerMail.connect(accountEmail, accountPassword);
        const emails = await hostingerMail.fetchInbox(20);

        let processedCount = 0;

        for (const email of emails) {
            // 1. Check if email already processed via messageId
            const { data: existingEmail } = await supabase
                .from('emails')
                .select('email_id')
                .eq('message_id', email.messageId)
                .single();

            if (existingEmail) continue; // Skip duplicates

            // 2. Extract CRM Intelligence
            const cleanEmailAddress = email.from.match(/<([^>]+)>/)?.[1] || email.from;
            const orgData = crmExtractor.extractOrganization(cleanEmailAddress);
            const contactName = crmExtractor.extractName(email.from);

            let buyerId = null;

            // 3. Upsert Buyer & Contact
            if (orgData && !orgData.isGeneric) {
                // Find or create buyer
                let { data: buyer } = await supabase
                    .from('buyers')
                    .select('buyer_id')
                    .eq('organization_name', orgData.suggestedName)
                    .single();
                
                if (!buyer) {
                    const { data: newBuyer } = await supabase
                        .from('buyers')
                        .insert({ organization_name: orgData.suggestedName, buyer_type: 'LEAD' })
                        .select('buyer_id')
                        .single();
                    buyer = newBuyer;
                }

                buyerId = buyer?.buyer_id;

                // Find or create contact
                if (buyerId) {
                    const { data: contact } = await supabase
                        .from('contacts')
                        .select('contact_id')
                        .eq('email', cleanEmailAddress)
                        .single();
                    
                    if (!contact) {
                        await supabase.from('contacts').insert({
                            buyer_id: buyerId,
                            full_name: contactName,
                            email: cleanEmailAddress
                        });
                    }
                }
            }

            // 4. Create Email Thread
            const { data: thread } = await supabase
                .from('email_threads')
                .insert({
                    buyer_id: buyerId,
                    subject: email.subject,
                    status: orgData?.isGeneric ? 'UNCLASSIFIED' : 'OPEN'
                })
                .select('thread_id')
                .single();

            // 5. Insert Email
            await supabase.from('emails').insert({
                thread_id: thread.thread_id,
                sender_email: cleanEmailAddress,
                recipient_email: accountEmail,
                body_text: email.bodyText,
                message_id: email.messageId,
                direction: 'INBOUND',
                sent_at: email.date
            });

            processedCount++;
        }

        console.log(`[MailSync] Finished sync. Processed ${processedCount} new emails.`);
        return processedCount;
    }
}

module.exports = new MailSyncService();
