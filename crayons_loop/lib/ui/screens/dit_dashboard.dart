import 'dart:io';
import 'package:flutter/material.dart';
import '../../core/services/ingest_engine.dart';

class DITDashboardScreen extends StatefulWidget {
  const DITDashboardScreen({super.key});

  @override
  State<DITDashboardScreen> createState() => _DITDashboardScreenState();
}

class _DITDashboardScreenState extends State<DITDashboardScreen> {
  final IngestEngine _engine = IngestEngine();
  
  // State variables for Card Registration Module
  final TextEditingController _cardLabelCtrl = TextEditingController(text: 'A001_C001_0101XY');
  final TextEditingController _cameraUnitCtrl = TextEditingController(text: 'A-Cam');
  
  IngestSession? _currentSession;

  @override
  void initState() {
    super.initState();
    _engine.progressStream.listen((session) {
      setState(() {
        _currentSession = session;
      });
    });
  }

  void _startMockUpload() {
    // We would use file picker in real app
    final mockFile = File('/Volumes/RED_MINI_MAG/A001_C001_0101XY.R3D');
    _engine.startUpload('mock-card-id', mockFile);
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: const Color(0xFF000000), // Strict operational black
      appBar: AppBar(
        title: const Text('DIT INGEST STATION', style: TextStyle(letterSpacing: 2.0, fontWeight: FontWeight.w900)),
        backgroundColor: Colors.black,
        bottom: PreferredSize(
          preferredSize: const Size.fromHeight(1.0),
          child: Container(color: Colors.white24, height: 1.0),
        ),
      ),
      body: Padding(
        padding: const EdgeInsets.all(32.0),
        child: Row(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            // Left Panel: Card Registration
            Expanded(
              flex: 1,
              child: _buildCardRegistrationModule(),
            ),
            const SizedBox(width: 32),
            // Right Panel: Queue and Integrity Light
            Expanded(
              flex: 2,
              child: Column(
                children: [
                  _buildIntegrityTrafficLight(),
                  const SizedBox(height: 32),
                  _buildUploadQueue(),
                ],
              ),
            )
          ],
        ),
      ),
    );
  }

  Widget _buildCardRegistrationModule() {
    return Container(
      padding: const EdgeInsets.all(24),
      decoration: BoxDecoration(
        border: Border.all(color: Colors.white24),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          const Text('CARD REGISTRATION', style: TextStyle(color: Colors.white, fontSize: 18, fontWeight: FontWeight.bold)),
          const SizedBox(height: 24),
          TextField(
            controller: _cardLabelCtrl,
            style: const TextStyle(color: Colors.white),
            decoration: const InputDecoration(
              labelText: 'Card Label / Reel Name',
              labelStyle: TextStyle(color: Colors.white54),
              enabledBorder: OutlineInputBorder(borderSide: BorderSide(color: Colors.white24)),
              focusedBorder: OutlineInputBorder(borderSide: BorderSide(color: Colors.white)),
            ),
          ),
          const SizedBox(height: 16),
          TextField(
            controller: _cameraUnitCtrl,
            style: const TextStyle(color: Colors.white),
            decoration: const InputDecoration(
              labelText: 'Camera Unit',
              labelStyle: TextStyle(color: Colors.white54),
              enabledBorder: OutlineInputBorder(borderSide: BorderSide(color: Colors.white24)),
              focusedBorder: OutlineInputBorder(borderSide: BorderSide(color: Colors.white)),
            ),
          ),
          const SizedBox(height: 16),
          // Mock Shoot Day Dropdown
          DropdownButtonFormField<String>(
            value: 'Shoot Day 4',
            dropdownColor: Colors.grey[900],
            style: const TextStyle(color: Colors.white),
            decoration: const InputDecoration(
              labelText: 'Attach to Shoot Day',
              labelStyle: TextStyle(color: Colors.white54),
              enabledBorder: OutlineInputBorder(borderSide: BorderSide(color: Colors.white24)),
            ),
            items: ['Shoot Day 1', 'Shoot Day 2', 'Shoot Day 3', 'Shoot Day 4']
                .map((day) => DropdownMenuItem(value: day, child: Text(day)))
                .toList(),
            onChanged: (val) {},
          ),
          const SizedBox(height: 32),
          SizedBox(
            width: double.infinity,
            height: 50,
            child: ElevatedButton.icon(
              style: ElevatedButton.styleFrom(
                backgroundColor: Colors.white,
                foregroundColor: Colors.black,
                shape: const RoundedRectangleBorder(borderRadius: BorderRadius.zero),
              ),
              icon: const Icon(Icons.upload_file),
              label: const Text('SELECT FOLDER & INGEST', style: TextStyle(fontWeight: FontWeight.bold)),
              onPressed: _startMockUpload,
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildIntegrityTrafficLight() {
    Color trafficColor;
    String statusText;
    IconData statusIcon;

    if (_currentSession == null || _currentSession!.status == 'PENDING') {
      trafficColor = Colors.grey[800]!;
      statusText = 'AWAITING CARD';
      statusIcon = Icons.sd_storage;
    } else if (_currentSession!.status == 'COMPLETED' && _currentSession!.verificationStatus == 'SAFE TO FORMAT') {
      trafficColor = Colors.greenAccent;
      statusText = 'SAFE TO FORMAT';
      statusIcon = Icons.check_circle;
    } else if (_currentSession!.status == 'ERROR' || _currentSession!.verificationStatus == 'MISMATCH') {
      trafficColor = Colors.redAccent;
      statusText = 'DO NOT FORMAT - MISMATCH';
      statusIcon = Icons.error;
    } else {
      trafficColor = Colors.amberAccent;
      statusText = 'UPLOADING & HASHING - DO NOT EJECT';
      statusIcon = Icons.sync;
    }

    return Container(
      width: double.infinity,
      padding: const EdgeInsets.all(24),
      decoration: BoxDecoration(
        color: trafficColor.withOpacity(0.1),
        border: Border.all(color: trafficColor, width: 2),
      ),
      child: Row(
        mainAxisAlignment: MainAxisAlignment.center,
        children: [
          Icon(statusIcon, color: trafficColor, size: 32),
          const SizedBox(width: 16),
          Text(
            statusText,
            style: TextStyle(color: trafficColor, fontSize: 24, fontWeight: FontWeight.w900, letterSpacing: 1.5),
          ),
        ],
      ),
    );
  }

  Widget _buildUploadQueue() {
    if (_currentSession == null) {
      return Expanded(
        child: Container(
          decoration: BoxDecoration(border: Border.all(color: Colors.white24)),
          child: const Center(child: Text('QUEUE EMPTY', style: TextStyle(color: Colors.white54, fontWeight: FontWeight.bold))),
        ),
      );
    }

    final s = _currentSession!;
    final progressPct = (s.progress * 100).toStringAsFixed(1);
    final speed = (s.speedBytesPerSec / (1024 * 1024)).toStringAsFixed(2);

    return Expanded(
      child: Container(
        padding: const EdgeInsets.all(24),
        decoration: BoxDecoration(
          border: Border.all(color: Colors.white24),
        ),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            const Text('ACTIVE TRANSFER', style: TextStyle(color: Colors.white, fontSize: 18, fontWeight: FontWeight.bold)),
            const SizedBox(height: 24),
            Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                Text(s.file.path.split('/').last, style: const TextStyle(color: Colors.white, fontSize: 16)),
                Text('$progressPct%', style: const TextStyle(color: Colors.white, fontSize: 16, fontWeight: FontWeight.bold)),
              ],
            ),
            const SizedBox(height: 16),
            LinearProgressIndicator(
              value: s.progress,
              backgroundColor: Colors.white24,
              valueColor: const AlwaysStoppedAnimation<Color>(Colors.white),
              minHeight: 12,
            ),
            const SizedBox(height: 16),
            Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                Text('Status: ${s.status}', style: const TextStyle(color: Colors.white54)),
                Text('Speed: $speed MB/s', style: const TextStyle(color: Colors.white54)),
              ],
            ),
            const Spacer(),
            SizedBox(
              width: double.infinity,
              height: 60,
              child: ElevatedButton.icon(
                style: ElevatedButton.styleFrom(
                  backgroundColor: s.status == 'UPLOADING' ? Colors.amber : Colors.white,
                  foregroundColor: Colors.black,
                  shape: const RoundedRectangleBorder(borderRadius: BorderRadius.zero),
                ),
                icon: Icon(s.status == 'UPLOADING' ? Icons.pause : Icons.play_arrow),
                label: Text(s.status == 'UPLOADING' ? 'PAUSE TRANSFER' : 'RESUME TRANSFER', style: const TextStyle(fontWeight: FontWeight.w900, fontSize: 18)),
                onPressed: () {
                  if (s.status == 'UPLOADING') {
                    _engine.pauseUpload(s.sessionId);
                  } else if (s.status == 'PAUSED') {
                    _engine.resumeUpload(s.sessionId);
                  }
                },
              ),
            )
          ],
        ),
      ),
    );
  }
}
