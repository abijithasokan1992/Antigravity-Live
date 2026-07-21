import 'package:flutter/material.dart';
import 'package:http/http.dart' as http;
import 'dart:convert';

class BlockchainRegistryView extends StatefulWidget {
  const BlockchainRegistryView({super.key});

  @override
  State<BlockchainRegistryView> createState() => _BlockchainRegistryViewState();
}

class _BlockchainRegistryViewState extends State<BlockchainRegistryView> {
  // Ledger entries will be fetched from the backend
  List<Map<String, dynamic>> _ledger = [];

  @override
  void initState() {
    super.initState();
    _fetchLedger();
  }

  Future<void> _fetchLedger() async {
    try {
      final response = await http.get(Uri.parse('http://localhost:4000/api/v1/blockchain/ledger'));
      if (response.statusCode == 200) {
        final data = jsonDecode(response.body);
        if (data['success'] == true && data['ledger'] != null) {
          setState(() {
            _ledger = List<Map<String, dynamic>>.from(data['ledger']);
          });
        }
      } else {
        ScaffoldMessenger.of(context).showSnackBar(const SnackBar(content: Text('Failed to load ledger')));
      }
    } catch (e) {
      ScaffoldMessenger.of(context).showSnackBar(SnackBar(content: Text('Error: $e')));
    }
  }

  @override
  Widget build(BuildContext context) {
    return Container(
      color: const Color(0xFF0F0F0F),
      padding: const EdgeInsets.all(48.0),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              const Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(
                    'SECURE RIGHTS LEDGER',
                    style: TextStyle(
                      color: Colors.white,
                      fontSize: 24,
                      fontWeight: FontWeight.bold,
                      letterSpacing: 2,
                    ),
                  ),
                  SizedBox(height: 16),
                  Text(
                    'Immutable cryptographic audit trail of asset ownership and licensing contracts.',
                    style: TextStyle(color: Colors.white54, fontSize: 16),
                  ),
                ],
              ),
              OutlinedButton.icon(
                style: OutlinedButton.styleFrom(
                  foregroundColor: Colors.white,
                  side: const BorderSide(color: Colors.white24),
                  padding: const EdgeInsets.symmetric(horizontal: 24, vertical: 16),
                ),
                icon: const Icon(Icons.fingerprint),
                label: const Text('RECORD ENTRY', style: TextStyle(fontWeight: FontWeight.bold)),
                onPressed: () async {
                  final response = await http.post(
                    Uri.parse('http://localhost:4000/api/v1/blockchain/mint'),
                    headers: {'Content-Type': 'application/json'},
                    body: '{"projectId":"12345","projectName":"Demo Project","ownerEmail":"demo@example.com"}',
                  );
                  final message = response.statusCode == 200
                      ? 'Ledger entry recorded.'
                      : 'Failed to record entry.';
                  ScaffoldMessenger.of(context).showSnackBar(SnackBar(content: Text(message)));
                },
              )
            ],
          ),
          const SizedBox(height: 48),
          
          Expanded(
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
                  const Text('NETWORK: STREAMVISTA_PRIVATE_LEDGER', style: TextStyle(color: Colors.greenAccent, fontSize: 12, fontWeight: FontWeight.bold, letterSpacing: 1)),
                  const SizedBox(height: 32),
                  Expanded(
                    child: ListView.separated(
                      itemCount: _ledger.length,
                      separatorBuilder: (context, index) => const Divider(color: Colors.white10, height: 32),
                      itemBuilder: (context, index) {
                        final tx = _ledger[index];
                        return _buildLedgerEntry(tx);
                      },
                    ),
                  ),
                ],
              ),
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildLedgerEntry(Map<String, dynamic> tx) {
    return Row(
      children: [
        // Type Icon
        Container(
          padding: const EdgeInsets.all(12),
          decoration: BoxDecoration(
            color: tx['type'] == 'ASSET_MINT' ? Colors.blueAccent.withOpacity(0.2) : Colors.purpleAccent.withOpacity(0.2),
            borderRadius: BorderRadius.circular(8),
          ),
          child: Icon(
            tx['type'] == 'ASSET_MINT' ? Icons.diamond : Icons.gavel,
            color: tx['type'] == 'ASSET_MINT' ? Colors.blueAccent : Colors.purpleAccent,
          ),
        ),
        const SizedBox(width: 24),
        
        // Content
        Expanded(
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Row(
                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                children: [
                  Text(tx['asset'], style: const TextStyle(color: Colors.white, fontWeight: FontWeight.bold, fontSize: 16)),
                  Text(tx['time'], style: const TextStyle(color: Colors.white38, fontSize: 12)),
                ],
              ),
              const SizedBox(height: 8),
              Text(tx['details'], style: const TextStyle(color: Colors.white70, fontSize: 14)),
              const SizedBox(height: 8),
              Row(
                children: [
                  const Text('TxID: ', style: TextStyle(color: Colors.white38, fontSize: 12, fontFamily: 'monospace')),
                  Text(tx['hash'], style: const TextStyle(color: Colors.greenAccent, fontSize: 12, fontFamily: 'monospace')),
                ],
              )
            ],
          ),
        ),
      ],
    );
  }
}
