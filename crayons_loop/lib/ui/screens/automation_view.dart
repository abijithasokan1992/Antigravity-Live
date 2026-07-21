import 'package:flutter/material.dart';

class AutomationView extends StatefulWidget {
  const AutomationView({super.key});

  @override
  State<AutomationView> createState() => _AutomationViewState();
}

class _AutomationViewState extends State<AutomationView> {
  // Mock State for Automation Rules
  final Map<String, bool> _rules = {
    'AUTO_DISPATCH_ON_CLOSE': true,
    'AUTO_CREATE_LEAD': true,
    'AUTO_SCREENER_DELIVERY': false,
  };

  // Mock Activity Log
  final List<String> _logs = [
    '[10:45 AM] AUTO_CREATE_LEAD: Extracted Amrita TV from inbound email.',
    '[09:12 AM] AUTO_DISPATCH_ON_CLOSE: Queued Distribution job for Jio SVOD package.',
    '[Yesterday] AUTO_CREATE_LEAD: Extracted Netflix India from inbound email.',
  ];

  @override
  Widget build(BuildContext context) {
    return Container(
      color: const Color(0xFF0F0F0F),
      padding: const EdgeInsets.all(48.0),
      child: Row(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          // Left Pane: Automation Rules
          Expanded(
            flex: 3,
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                const Text(
                  'AUTOMATION ENGINE',
                  style: TextStyle(
                    color: Colors.white,
                    fontSize: 24,
                    fontWeight: FontWeight.bold,
                    letterSpacing: 2,
                  ),
                ),
                const SizedBox(height: 16),
                const Text(
                  'Configure autonomous rules that interconnect the Mail Center, CRM, and Distribution Hub.',
                  style: TextStyle(color: Colors.white54, fontSize: 16),
                ),
                const SizedBox(height: 48),
                Expanded(
                  child: ListView(
                    children: [
                      _buildRuleTile(
                        'AUTO_CREATE_LEAD',
                        'Auto-Create CRM Lead',
                        'Automatically parses inbound emails and creates a Lead in the Buyer CRM if a high-value enterprise domain is detected.',
                      ),
                      _buildRuleTile(
                        'AUTO_DISPATCH_ON_CLOSE',
                        'Auto-Fulfillment on Deal Close',
                        'Automatically queues a transcoding and packaging job in the Distribution Hub the moment a deal is marked "CLOSED WON".',
                      ),
                      _buildRuleTile(
                        'AUTO_SCREENER_DELIVERY',
                        'Auto-Deliver Proxy Screener',
                        'Automatically replies with a secure, watermarked proxy screener if a high-scoring lead requests review.',
                      ),
                    ],
                  ),
                )
              ],
            ),
          ),
          
          const SizedBox(width: 48),
          
          // Right Pane: Activity Log
          Expanded(
            flex: 2,
            child: Container(
              padding: const EdgeInsets.all(32),
              decoration: BoxDecoration(
                color: const Color(0xFF161616),
                border: Border.all(color: Colors.white12),
                borderRadius: BorderRadius.circular(8),
              ),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  const Text('REAL-TIME ACTIVITY LOG', style: TextStyle(color: Colors.white, fontWeight: FontWeight.bold, letterSpacing: 1)),
                  const SizedBox(height: 24),
                  Expanded(
                    child: ListView.builder(
                      itemCount: _logs.length,
                      itemBuilder: (context, index) {
                        return Padding(
                          padding: const EdgeInsets.only(bottom: 16.0),
                          child: Text(
                            _logs[index],
                            style: const TextStyle(color: Colors.greenAccent, fontFamily: 'monospace', fontSize: 12),
                          ),
                        );
                      },
                    ),
                  )
                ],
              ),
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildRuleTile(String key, String title, String description) {
    final isActive = _rules[key] ?? false;

    return Container(
      margin: const EdgeInsets.only(bottom: 16),
      decoration: BoxDecoration(
        color: const Color(0xFF161616),
        border: Border.all(color: isActive ? Colors.blueAccent.withOpacity(0.5) : Colors.white12),
        borderRadius: BorderRadius.circular(8),
      ),
      child: ListTile(
        contentPadding: const EdgeInsets.all(24),
        title: Text(title, style: const TextStyle(color: Colors.white, fontWeight: FontWeight.bold, fontSize: 18)),
        subtitle: Padding(
          padding: const EdgeInsets.only(top: 8.0),
          child: Text(description, style: const TextStyle(color: Colors.white54, fontSize: 14)),
        ),
        trailing: Switch(
          value: isActive,
          activeColor: Colors.blueAccent,
          onChanged: (val) {
            setState(() {
              _rules[key] = val;
            });
            ScaffoldMessenger.of(context).showSnackBar(SnackBar(content: Text('Rule $key ${val ? "ENABLED" : "DISABLED"}')));
          },
        ),
      ),
    );
  }
}
