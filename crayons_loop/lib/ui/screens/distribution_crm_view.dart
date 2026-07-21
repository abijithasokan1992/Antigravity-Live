import 'package:flutter/material.dart';

class DistributionCrmView extends StatefulWidget {
  const DistributionCrmView({super.key});

  @override
  State<DistributionCrmView> createState() => _DistributionCrmViewState();
}

class _DistributionCrmViewState extends State<DistributionCrmView> {
  // Mock Data for active fulfillment jobs
  final List<Map<String, dynamic>> _jobs = [
    {
      'id': 'job-001',
      'buyer': 'Jio',
      'project': 'Jananam 1947',
      'destination': 'S3 (MUMBAI)',
      'preset': 'ProRes 422HQ',
      'status': 'TRANSCODING',
      'progress': 0.65,
    },
    {
      'id': 'job-002',
      'buyer': 'Amrita TV',
      'project': 'Jananam 1947',
      'destination': 'ASPERA',
      'preset': 'H264_1080p_50i',
      'status': 'QUEUED',
      'progress': 0.0,
    },
    {
      'id': 'job-003',
      'buyer': 'Netflix India',
      'project': 'Indie Shorts Vol 1',
      'destination': 'IMF PACKAGE',
      'preset': 'Dolby Vision Profile 5',
      'status': 'DELIVERED',
      'progress': 1.0,
    },
  ];

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
                    'DISTRIBUTION HUB / FULFILLMENT',
                    style: TextStyle(
                      color: Colors.white,
                      fontSize: 24,
                      fontWeight: FontWeight.bold,
                      letterSpacing: 2,
                    ),
                  ),
                  SizedBox(height: 16),
                  Text(
                    'Monitor automated transcoding and delivery pipelines to buyer endpoints.',
                    style: TextStyle(color: Colors.white54, fontSize: 16),
                  ),
                ],
              ),
              ElevatedButton.icon(
                style: ElevatedButton.styleFrom(
                  backgroundColor: Colors.white,
                  foregroundColor: Colors.black,
                  padding: const EdgeInsets.symmetric(horizontal: 24, vertical: 16),
                ),
                icon: const Icon(Icons.rocket_launch),
                label: const Text('NEW DISPATCH', style: TextStyle(fontWeight: FontWeight.bold)),
                onPressed: () {
                  ScaffoldMessenger.of(context).showSnackBar(const SnackBar(content: Text('Triggering /api/v1/distribution/dispatch...')));
                },
              )
            ],
          ),
          const SizedBox(height: 48),
          
          Expanded(
            child: ListView.builder(
              itemCount: _jobs.length,
              itemBuilder: (context, index) {
                final job = _jobs[index];
                return _buildJobRow(job);
              },
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildJobRow(Map<String, dynamic> job) {
    final isComplete = job['status'] == 'DELIVERED';
    final isRunning = job['status'] == 'TRANSCODING' || job['status'] == 'PACKAGING';
    
    return Container(
      margin: const EdgeInsets.only(bottom: 16),
      padding: const EdgeInsets.all(24),
      decoration: BoxDecoration(
        color: const Color(0xFF161616),
        border: Border.all(color: Colors.white12),
        borderRadius: BorderRadius.circular(8),
      ),
      child: Row(
        children: [
          // Job Info
          Expanded(
            flex: 2,
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Row(
                  children: [
                    const Icon(Icons.business, color: Colors.white24, size: 16),
                    const SizedBox(width: 8),
                    Text(job['buyer'], style: const TextStyle(color: Colors.white, fontWeight: FontWeight.bold, fontSize: 16)),
                  ],
                ),
                const SizedBox(height: 8),
                Text(job['project'], style: const TextStyle(color: Colors.white54, fontSize: 14)),
              ],
            ),
          ),
          
          // Specs
          Expanded(
            flex: 2,
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                _buildSpecTag('DESTINATION', job['destination']),
                const SizedBox(height: 8),
                _buildSpecTag('FORMAT PRESET', job['preset']),
              ],
            ),
          ),
          
          // Progress Bar & Status
          Expanded(
            flex: 3,
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Row(
                  mainAxisAlignment: MainAxisAlignment.spaceBetween,
                  children: [
                    Text(
                      job['status'],
                      style: TextStyle(
                        color: isComplete ? Colors.greenAccent : (isRunning ? Colors.blueAccent : Colors.white54),
                        fontWeight: FontWeight.bold,
                        letterSpacing: 1,
                        fontSize: 12
                      ),
                    ),
                    Text(
                      '${(job['progress'] * 100).toInt()}%',
                      style: const TextStyle(color: Colors.white, fontWeight: FontWeight.bold),
                    )
                  ],
                ),
                const SizedBox(height: 12),
                LinearProgressIndicator(
                  value: job['progress'],
                  backgroundColor: Colors.white10,
                  color: isComplete ? Colors.greenAccent : Colors.blueAccent,
                  minHeight: 6,
                  borderRadius: BorderRadius.circular(4),
                )
              ],
            ),
          ),
          
          const SizedBox(width: 32),
          
          // Actions
          IconButton(
            icon: Icon(Icons.more_vert, color: Colors.white54),
            onPressed: () {},
          )
        ],
      ),
    );
  }
  
  Widget _buildSpecTag(String label, String value) {
    return Row(
      children: [
        Text('$label: ', style: const TextStyle(color: Colors.white38, fontSize: 10, fontWeight: FontWeight.bold)),
        Text(value, style: const TextStyle(color: Colors.white, fontSize: 12, fontWeight: FontWeight.w600)),
      ],
    );
  }
}
