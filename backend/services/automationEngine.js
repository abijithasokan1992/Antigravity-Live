// services/automationEngine.js
const DistributionEngine = require('./distributionEngine');

/**
 * Automation Engine
 * Listens for core business events and triggers subsequent actions if the corresponding rules are active.
 */
class AutomationEngine {
  
  /**
   * Event Trigger: Fired when a deal is marked "CLOSED WON" in the Buyer CRM.
   * @param {string} dealId 
   * @param {string} dealName 
   */
  static async onDealClosed(dealId, dealName) {
    console.log(`[Automation] Event triggered: onDealClosed (${dealId})`);
    
    // In production, we query Supabase to check if 'AUTO_DISPATCH_ON_CLOSE' is active.
    // Assuming true for this demonstration:
    const isRuleActive = true; 
    
    if (isRuleActive) {
      console.log(`[Automation] Rule AUTO_DISPATCH_ON_CLOSE is active. Queueing fulfillment.`);
      // Trigger the Distribution Hub
      await DistributionEngine.triggerDelivery(dealName, 'ProRes_422HQ');
      
      // Log the automation action
      await this._logAction('AUTO_DISPATCH_ON_CLOSE', `Queued Distribution Fulfillment for ${dealName}`, dealId);
    }
  }

  /**
   * Event Trigger: Fired when an inbound email hits the Mail Center.
   */
  static async onEmailReceived(emailId, senderDomain) {
    console.log(`[Automation] Event triggered: onEmailReceived (${emailId})`);
    
    // In production, query if 'AUTO_CREATE_LEAD' is active.
    const isRuleActive = true; 

    if (isRuleActive) {
       // Logic to check domain heuristic and insert into Buyer CRM
       await this._logAction('AUTO_CREATE_LEAD', `Created CRM Lead from ${senderDomain}`, emailId);
    }
  }

  /**
   * Helper to write to `automation_logs`
   */
  static async _logAction(ruleKey, action, targetId) {
    console.log(`[Automation Log] [${ruleKey}] ${action}`);
    // Supabase insert would happen here.
  }

}

module.exports = AutomationEngine;
