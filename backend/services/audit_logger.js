/**
 * services/audit_logger.js
 * 
 * Centralized service to guarantee an immutable chain of custody.
 * Enforces strict logging for CREATE, UPDATE, DELETE, and critical system events.
 */

const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.SUPABASE_URL || 'https://mock.supabase.co';
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || 'mock-key';
const supabase = createClient(supabaseUrl, supabaseKey);

class AuditLogger {
    /**
     * Logs a critical action to the immutable audit_logs table.
     * 
     * @param {string} userId UUID of the user performing the action
     * @param {string} action E.g., 'VERIFY_CARD_INGEST', 'GENERATE_DELIVERY'
     * @param {string} resourceType E.g., 'CAMERA_CARD', 'PROJECT', 'ASSET'
     * @param {string} resourceId UUID of the affected resource
     */
    async log(userId, action, resourceType, resourceId) {
        try {
            console.log(`[Audit] User ${userId} | ${action} | ${resourceType}:${resourceId}`);
            
            const { error } = await supabase.from('audit_logs').insert({
                user_id: userId,
                action: action,
                resource_type: resourceType,
                resource_id: resourceId,
                timestamp: new Date().toISOString()
            });

            if (error) {
                // In production, we'd fire an emergency alert if the audit log fails
                console.error('[Audit] Failed to write immutable log:', error.message);
            }
        } catch (err) {
            console.error('[Audit] Exception writing log:', err.message);
        }
    }
}

module.exports = new AuditLogger();
