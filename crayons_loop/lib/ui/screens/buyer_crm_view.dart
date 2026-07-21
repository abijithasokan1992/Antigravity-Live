import 'package:flutter/material.dart';

class BuyerCrmView extends StatefulWidget {
  const BuyerCrmView({super.key});

  @override
  State<BuyerCrmView> createState() => _BuyerCrmViewState();
}

class _BuyerCrmViewState extends State<BuyerCrmView> {
  // Mock CRM Data
  final Map<String, List<Map<String, String>>> _columns = {
    'LEAD': [
      {'org': 'Amrita TV', 'opportunity': 'Satellite Rights - Kerala', 'value': '\$50k'}
    ],
    'NEGOTIATING': [
      {'org': 'Jio', 'opportunity': 'Indie Catalog SVOD', 'value': '\$120k'}
    ],
    'CONTRACT SENT': [
      {'org': 'Netflix India', 'opportunity': 'Jananam 1947 Non-Exclusive', 'value': '\$85k'}
    ],
    'CLOSED WON': [
      {'org': 'Amazon Prime', 'opportunity': 'Global Distribution Package', 'value': '\$300k'}
    ],
  };

  @override
  Widget build(BuildContext context) {
    return Container(
      color: const Color(0xFF0F0F0F),
      padding: const EdgeInsets.all(48.0),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          const Text(
            'BUYER CRM / OPPORTUNITIES',
            style: TextStyle(
              color: Colors.white,
              fontSize: 24,
              fontWeight: FontWeight.bold,
              letterSpacing: 2,
            ),
          ),
          const SizedBox(height: 16),
          const Text(
            'Track high-value enterprise acquisitions and licensing deals.',
            style: TextStyle(color: Colors.white54, fontSize: 16),
          ),
          const SizedBox(height: 48),
          Expanded(
            child: Row(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                _buildKanbanColumn('LEAD', Colors.blueGrey),
                _buildKanbanColumn('NEGOTIATING', Colors.orangeAccent),
                _buildKanbanColumn('CONTRACT SENT', Colors.lightBlueAccent),
                _buildKanbanColumn('CLOSED WON', Colors.greenAccent),
              ],
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildKanbanColumn(String title, Color highlightColor) {
    final items = _columns[title] ?? [];

    return Expanded(
      child: Container(
        margin: const EdgeInsets.only(right: 24),
        decoration: BoxDecoration(
          color: const Color(0xFF161616),
          borderRadius: BorderRadius.circular(8),
          border: Border.all(color: Colors.white12),
        ),
        child: Column(
          children: [
            // Column Header
            Container(
              padding: const EdgeInsets.all(16),
              decoration: BoxDecoration(
                border: Border(bottom: BorderSide(color: highlightColor.withOpacity(0.5), width: 2)),
              ),
              child: Row(
                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                children: [
                  Text(title, style: const TextStyle(color: Colors.white, fontWeight: FontWeight.bold)),
                  Container(
                    padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 2),
                    decoration: BoxDecoration(
                      color: Colors.white12,
                      borderRadius: BorderRadius.circular(12),
                    ),
                    child: Text('${items.length}', style: const TextStyle(color: Colors.white70, fontSize: 12)),
                  ),
                ],
              ),
            ),
            // Cards
            Expanded(
              child: ListView.builder(
                padding: const EdgeInsets.all(16),
                itemCount: items.length,
                itemBuilder: (context, index) {
                  final card = items[index];
                  return _buildKanbanCard(card);
                },
              ),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildKanbanCard(Map<String, String> card) {
    return Container(
      margin: const EdgeInsets.only(bottom: 16),
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        color: const Color(0xFF1F1F1F),
        borderRadius: BorderRadius.circular(8),
        border: Border.all(color: Colors.white12),
        boxShadow: [
          BoxShadow(
            color: Colors.black.withOpacity(0.5),
            blurRadius: 4,
            offset: const Offset(0, 2),
          ),
        ],
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          // Primary Title: Organization Name (as requested)
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              Text(
                card['org'] ?? '',
                style: const TextStyle(color: Colors.white, fontSize: 16, fontWeight: FontWeight.bold),
              ),
              const Icon(Icons.business, color: Colors.white24, size: 16),
            ],
          ),
          const SizedBox(height: 8),
          // Secondary Title: Opportunity
          Text(
            card['opportunity'] ?? '',
            style: const TextStyle(color: Colors.white70, fontSize: 13),
          ),
          const SizedBox(height: 16),
          // Value and Action
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              Container(
                padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
                decoration: BoxDecoration(
                  color: Colors.greenAccent.withOpacity(0.1),
                  borderRadius: BorderRadius.circular(4),
                ),
                child: Text(
                  card['value'] ?? '',
                  style: const TextStyle(color: Colors.greenAccent, fontSize: 12, fontWeight: FontWeight.bold),
                ),
              ),
              const Icon(Icons.arrow_forward_ios, color: Colors.white54, size: 12),
            ],
          ),
        ],
      ),
    );
  }
}
