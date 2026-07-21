import 'package:flutter/material.dart';

class EditorialDeliveryScreen extends StatelessWidget {
  final String projectId;
  final String projectName;

  const EditorialDeliveryScreen({
    super.key,
    required this.projectId,
    required this.projectName,
  });

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: const Color(0xFF0F0F0F),
      appBar: AppBar(
        title: Text('EDITORIAL HANDOFF / $projectName', style: const TextStyle(letterSpacing: 1.5, fontWeight: FontWeight.bold)),
        backgroundColor: Colors.black,
        elevation: 0,
        bottom: PreferredSize(
          preferredSize: const Size.fromHeight(1.0),
          child: Container(color: Colors.white12, height: 1.0),
        ),
      ),
      body: Padding(
        padding: const EdgeInsets.all(48.0),
        child: Row(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            // Left Side: Visual Package Tree
            Expanded(
              flex: 2,
              child: _buildPackageTree(),
            ),
            const SizedBox(width: 48),
            // Right Side: Download Actions & Manifest
            Expanded(
              flex: 1,
              child: _buildDownloadActionPanel(),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildPackageTree() {
    return Container(
      padding: const EdgeInsets.all(32),
      decoration: BoxDecoration(
        color: const Color(0xFF161616),
        border: Border.all(color: Colors.white12),
        borderRadius: BorderRadius.circular(8),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          const Row(
            children: [
              Icon(Icons.inventory_2, color: Colors.white, size: 28),
              SizedBox(width: 16),
              Text('PACKAGE CONTENTS', style: TextStyle(color: Colors.white, fontSize: 20, fontWeight: FontWeight.bold)),
            ],
          ),
          const SizedBox(height: 32),
          // A mocked visual directory tree
          _buildTreeItem(Icons.folder_open, 'PROXIES/', isFolder: true),
          _buildTreeItem(Icons.video_file, '   ├── A001_C001_0101XY_proxy.mp4'),
          _buildTreeItem(Icons.video_file, '   ├── A001_C002_0101XY_proxy.mp4'),
          _buildTreeItem(Icons.video_file, '   └── B001_C001_0101XY_proxy.mp4'),
          const SizedBox(height: 16),
          _buildTreeItem(Icons.folder_open, 'AUDIO/', isFolder: true),
          _buildTreeItem(Icons.audio_file, '   ├── MIXL_001.wav'),
          _buildTreeItem(Icons.audio_file, '   └── MIXL_002.wav'),
          const SizedBox(height: 16),
          _buildTreeItem(Icons.folder_open, 'REPORTS/', isFolder: true),
          _buildTreeItem(Icons.picture_as_pdf, '   └── DIT_Log_ShootDay4.pdf'),
        ],
      ),
    );
  }

  Widget _buildTreeItem(IconData icon, String label, {bool isFolder = false}) {
    return Padding(
      padding: const EdgeInsets.only(bottom: 12.0),
      child: Row(
        children: [
          Icon(icon, color: isFolder ? Colors.amberAccent : Colors.white54, size: 20),
          const SizedBox(width: 12),
          Text(
            label,
            style: TextStyle(
              color: isFolder ? Colors.white : Colors.white70,
              fontFamily: 'monospace',
              fontSize: 15,
              fontWeight: isFolder ? FontWeight.bold : FontWeight.normal,
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildDownloadActionPanel() {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        // Download Manifest Card
        Container(
          width: double.infinity,
          padding: const EdgeInsets.all(24),
          decoration: BoxDecoration(
            color: const Color(0xFF161616),
            border: Border.all(color: Colors.white12),
            borderRadius: BorderRadius.circular(8),
          ),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              const Text('VERIFICATION', style: TextStyle(color: Colors.white, fontSize: 16, fontWeight: FontWeight.bold, letterSpacing: 1)),
              const SizedBox(height: 16),
              const Text(
                'Download the checksum manifest to verify file integrity locally before importing into your NLE.',
                style: TextStyle(color: Colors.white54, height: 1.5),
              ),
              const SizedBox(height: 24),
              OutlinedButton.icon(
                style: OutlinedButton.styleFrom(
                  foregroundColor: Colors.white,
                  side: const BorderSide(color: Colors.white54),
                  padding: const EdgeInsets.symmetric(vertical: 16, horizontal: 24),
                ),
                icon: const Icon(Icons.download),
                label: const Text('DOWNLOAD MANIFEST (.sha256)'),
                onPressed: () {},
              )
            ],
          ),
        ),
        const SizedBox(height: 32),
        // Master Download Action
        Container(
          width: double.infinity,
          padding: const EdgeInsets.all(24),
          decoration: BoxDecoration(
            color: const Color(0xFF161616),
            border: Border.all(color: Colors.redAccent.withOpacity(0.5)),
            borderRadius: BorderRadius.circular(8),
          ),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              const Row(
                children: [
                  Icon(Icons.lock_clock, color: Colors.redAccent),
                  SizedBox(width: 12),
                  Text('EXPIRING LINK', style: TextStyle(color: Colors.redAccent, fontWeight: FontWeight.bold, letterSpacing: 1)),
                ],
              ),
              const SizedBox(height: 16),
              const Text(
                'This secure package link will expire in exactly 48 hours.',
                style: TextStyle(color: Colors.white70),
              ),
              const SizedBox(height: 24),
              SizedBox(
                width: double.infinity,
                child: ElevatedButton.icon(
                  style: ElevatedButton.styleFrom(
                    backgroundColor: Colors.white,
                    foregroundColor: Colors.black,
                    padding: const EdgeInsets.symmetric(vertical: 24),
                  ),
                  icon: const Icon(Icons.cloud_download, size: 28),
                  label: const Text(
                    'DOWNLOAD PACKAGE (140 GB)',
                    style: TextStyle(fontWeight: FontWeight.w900, fontSize: 16, letterSpacing: 1),
                  ),
                  onPressed: () {},
                ),
              )
            ],
          ),
        ),
      ],
    );
  }
}
