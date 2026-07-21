import 'package:flutter/material.dart';

class MailCenterView extends StatefulWidget {
  const MailCenterView({super.key});

  @override
  State<MailCenterView> createState() => _MailCenterViewState();
}

class _MailCenterViewState extends State<MailCenterView> {
  int _selectedFilter = 0; // 0 = Inbox, 1 = AI Classify

  // Mocked emails retrieved from the backend sync
  final List<Map<String, dynamic>> _emails = [
    {
      'id': '1',
      'sender': 'Acquisitions @ Amrita TV',
      'subject': 'Jananam 1947 - Malayalam Broadcast Rights',
      'snippet': 'Hi team, we are interested in the satellite rights for Kerala...',
      'status': 'OPEN',
      'time': '10:42 AM',
      'isClassified': true,
    },
    {
      'id': '2',
      'sender': 'Content @ Jio',
      'subject': 'JioTV OS Integration - SVOD Inquiry',
      'snippet': 'We would like to review the proxy screeners for your indie catalog.',
      'status': 'OPEN',
      'time': 'Yesterday',
      'isClassified': true,
    },
    {
      'id': '3',
      'sender': 'random.buyer@gmail.com',
      'subject': 'Inquiry for Distribution',
      'snippet': 'Can I get the rights to stream this in my local theater?',
      'status': 'UNCLASSIFIED',
      'time': 'Yesterday',
      'isClassified': false,
    },
  ];

  @override
  Widget build(BuildContext context) {
    return Column(
      children: [
        _buildHeader(),
        Expanded(
          child: Row(
            children: [
              // Thread List (Left)
              Container(
                width: 350,
                decoration: const BoxDecoration(
                  border: Border(right: BorderSide(color: Colors.white12)),
                ),
                child: _buildThreadList(),
              ),
              // Email Detail (Right)
              Expanded(
                child: _buildEmailDetail(),
              ),
            ],
          ),
        ),
      ],
    );
  }

  Widget _buildHeader() {
    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 32, vertical: 24),
      decoration: const BoxDecoration(
        border: Border(bottom: BorderSide(color: Colors.white12)),
      ),
      child: Row(
        mainAxisAlignment: MainAxisAlignment.spaceBetween,
        children: [
          Row(
            children: [
              _buildFilterChip('INBOX', 0),
              const SizedBox(width: 12),
              _buildFilterChip('AI CLASSIFY', 1, hasAlert: true),
              const SizedBox(width: 12),
              _buildFilterChip('SENT', 2),
            ],
          ),
          ElevatedButton.icon(
            style: ElevatedButton.styleFrom(
              backgroundColor: Colors.white,
              foregroundColor: Colors.black,
            ),
            icon: const Icon(Icons.sync),
            label: const Text('SYNC HOSTINGER'),
            onPressed: () {},
          )
        ],
      ),
    );
  }

  Widget _buildFilterChip(String label, int index, {bool hasAlert = false}) {
    final isSelected = _selectedFilter == index;
    return ChoiceChip(
      label: Row(
        children: [
          Text(label, style: const TextStyle(fontWeight: FontWeight.bold, letterSpacing: 1)),
          if (hasAlert) ...[
            const SizedBox(width: 8),
            Container(
              padding: const EdgeInsets.symmetric(horizontal: 6, vertical: 2),
              decoration: BoxDecoration(color: Colors.redAccent, borderRadius: BorderRadius.circular(12)),
              child: const Text('1', style: TextStyle(color: Colors.white, fontSize: 10)),
            )
          ]
        ],
      ),
      selected: isSelected,
      selectedColor: Colors.white24,
      backgroundColor: Colors.transparent,
      side: BorderSide(color: isSelected ? Colors.white : Colors.white12),
      onSelected: (val) {
        setState(() => _selectedFilter = index);
      },
    );
  }

  Widget _buildThreadList() {
    // Filter based on choice
    final filtered = _emails.where((e) {
      if (_selectedFilter == 1) return !e['isClassified'];
      if (_selectedFilter == 0) return e['isClassified'];
      return false;
    }).toList();

    return ListView.builder(
      itemCount: filtered.length,
      itemBuilder: (context, index) {
        final email = filtered[index];
        return InkWell(
          onTap: () {},
          child: Container(
            padding: const EdgeInsets.all(20),
            decoration: const BoxDecoration(
              border: Border(bottom: BorderSide(color: Colors.white12)),
            ),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Row(
                  mainAxisAlignment: MainAxisAlignment.spaceBetween,
                  children: [
                    Text(email['sender'], style: const TextStyle(color: Colors.white, fontWeight: FontWeight.bold)),
                    Text(email['time'], style: const TextStyle(color: Colors.white54, fontSize: 12)),
                  ],
                ),
                const SizedBox(height: 8),
                Text(email['subject'], style: const TextStyle(color: Colors.white70, fontSize: 13, fontWeight: FontWeight.bold)),
                const SizedBox(height: 4),
                Text(
                  email['snippet'],
                  style: const TextStyle(color: Colors.white54, fontSize: 12),
                  maxLines: 2,
                  overflow: TextOverflow.ellipsis,
                ),
              ],
            ),
          ),
        );
      },
    );
  }

  Widget _buildEmailDetail() {
    // Mocking the selected state of the first email
    return Container(
      color: const Color(0xFF121212),
      padding: const EdgeInsets.all(48),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          const Text('Jananam 1947 - Malayalam Broadcast Rights', style: TextStyle(color: Colors.white, fontSize: 24, fontWeight: FontWeight.bold)),
          const SizedBox(height: 24),
          const Row(
            children: [
              CircleAvatar(backgroundColor: Colors.white24, child: Icon(Icons.business, color: Colors.white)),
              SizedBox(width: 16),
              Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Row(
                    children: [
                      Text('Acquisitions @ Amrita TV', style: TextStyle(color: Colors.white, fontWeight: FontWeight.bold)),
                      SizedBox(width: 12),
                      Container(
                        padding: EdgeInsets.symmetric(horizontal: 6, vertical: 2),
                        decoration: BoxDecoration(color: Colors.orangeAccent.withOpacity(0.2), borderRadius: BorderRadius.circular(4)),
                        child: Text('🔥 SCORE: 80/100', style: TextStyle(color: Colors.orangeAccent, fontSize: 10, fontWeight: FontWeight.bold)),
                      ),
                    ],
                  ),
                  Text('acquisitions@amrita.tv', style: TextStyle(color: Colors.white54, fontSize: 12)),
                ],
              ),
            ],
          ),
          const SizedBox(height: 48),
          const Text(
            'Hi StreamVista Team,\n\nWe recently saw the festival run for Jananam 1947. We are highly interested in negotiating the satellite broadcast rights for the Kerala region.\n\nCould you please dispatch a secure screener proxy for our legal and editorial teams to review?\n\nBest,\nAmrita Acquisitions',
            style: TextStyle(color: Colors.white70, fontSize: 15, height: 1.6),
          ),
          const Spacer(),
          // Action Bar
          Container(
            padding: const EdgeInsets.all(24),
            decoration: BoxDecoration(
              color: const Color(0xFF161616),
              border: Border.all(color: Colors.white12),
              borderRadius: BorderRadius.circular(8),
            ),
            child: Row(
              children: [
                Expanded(
                  child: OutlinedButton.icon(
                    style: OutlinedButton.styleFrom(
                      foregroundColor: Colors.white,
                      side: const BorderSide(color: Colors.white24),
                      padding: const EdgeInsets.symmetric(vertical: 20),
                    ),
                    icon: const Icon(Icons.handshake),
                    label: const Text('CONVERT TO BUYER CRM'),
                    onPressed: () {},
                  ),
                ),
                const SizedBox(width: 16),
                Expanded(
                  child: ElevatedButton.icon(
                    style: ElevatedButton.styleFrom(
                      backgroundColor: Colors.purpleAccent.withOpacity(0.2),
                      foregroundColor: Colors.purpleAccent,
                      padding: const EdgeInsets.symmetric(vertical: 20),
                      elevation: 0,
                    ),
                    icon: const Text('🪄'),
                    label: const Text('AI ASSIST DRAFT'),
                    onPressed: () {
                      // Mocking the AI Scorer response
                      ScaffoldMessenger.of(context).showSnackBar(
                        const SnackBar(
                          content: Text('AI: Drafted response based on Satellite Rights availability in Kerala.'),
                          backgroundColor: Colors.purpleAccent,
                        )
                      );
                    },
                  ),
                ),
                const SizedBox(width: 16),
                Expanded(
                  child: ElevatedButton.icon(
                    style: ElevatedButton.styleFrom(
                      backgroundColor: Colors.redAccent,
                      foregroundColor: Colors.white,
                      padding: const EdgeInsets.symmetric(vertical: 20),
                    ),
                    icon: const Icon(Icons.send),
                    label: const Text('REPLY WITH SCREENER'),
                    onPressed: () {},
                  ),
                ),
              ],
            ),
          )
        ],
      ),
    );
  }
}
