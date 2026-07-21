/**
 * services/crmExtractor.js
 * 
 * Analyzes raw email data to extract CRM Lead intelligence.
 */

class CRMExtractor {
    /**
     * Extracts domain from email and infers organization details.
     * @param {string} emailAddress 
     * @returns {Object} Organization mapping
     */
    extractOrganization(emailAddress) {
        if (!emailAddress || !emailAddress.includes('@')) return null;

        const domain = emailAddress.split('@')[1].toLowerCase();
        
        // Skip generic domains
        const genericDomains = ['gmail.com', 'yahoo.com', 'hotmail.com', 'outlook.com'];
        if (genericDomains.includes(domain)) {
            return {
                isGeneric: true,
                domain: domain,
                suggestedName: 'UNCLASSIFIED'
            };
        }

        // Simple heuristic: capitalize domain name
        const rawName = domain.split('.')[0];
        const suggestedName = rawName.charAt(0).toUpperCase() + rawName.slice(1);

        return {
            isGeneric: false,
            domain: domain,
            suggestedName: suggestedName
        };
    }

    /**
     * Attempts to parse the sender's full name from the raw "From:" header
     * E.g., "John Doe <john@amrita.tv>" -> "John Doe"
     */
    extractName(fromHeader) {
        if (!fromHeader) return 'Unknown Contact';
        
        const match = fromHeader.match(/^([^<]+)/);
        if (match && match[1]) {
            const cleanName = match[1].replace(/"/g, '').trim();
            return cleanName || 'Unknown Contact';
        }
        return 'Unknown Contact';
    }
}

module.exports = new CRMExtractor();
