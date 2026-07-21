import 'dart:async';
import 'dart:io';
import 'dart:isolate';
import 'package:dio/dio.dart';
import '../api/dio_client.dart';

// Represents an active chunked upload session
class IngestSession {
  final String sessionId;
  final File file;
  final int chunkSize;
  double progress = 0.0;
  String status = 'PENDING'; // PENDING, UPLOADING, PAUSED, VERIFYING, COMPLETED
  String verificationStatus = 'PENDING';
  int speedBytesPerSec = 0;

  IngestSession({
    required this.sessionId,
    required this.file,
    this.chunkSize = 50 * 1024 * 1024, // 50MB
  });
}

class IngestEngine {
  final DioClient _api = DioClient();
  final Map<String, IngestSession> _activeSessions = {};
  
  // Stream to update the UI on progress
  final StreamController<IngestSession> _progressController = StreamController.broadcast();
  Stream<IngestSession> get progressStream => _progressController.stream;

  // Start or resume an upload
  Future<void> startUpload(String cardId, File file) async {
    final session = IngestSession(
      sessionId: 'sess_${DateTime.now().millisecondsSinceEpoch}',
      file: file,
    );
    _activeSessions[session.sessionId] = session;
    
    session.status = 'UPLOADING';
    _progressController.add(session);

    try {
      // 1. Get Presigned URL
      final initRes = await _api.dio.post('/creator_cloud/api/v1/ingest-sessions', data: {
        'asset_type': 'CAMERA_RAW',
        'filename': file.path.split('/').last,
        'card_id': cardId
      });
      
      final presignedData = initRes.data['session'];

      // 2. Perform chunked reading & hashing via Isolate (Mocked logic here)
      // In production, we read the file stream, compute XXH3/SHA256, and upload chunk by chunk
      final totalSize = await file.length();
      int uploaded = 0;
      
      // Simulate chunk uploads for demo UI
      while (uploaded < totalSize && session.status == 'UPLOADING') {
        int chunk = session.chunkSize;
        if (uploaded + chunk > totalSize) {
          chunk = totalSize - uploaded;
        }

        // Simulate network delay
        await Future.delayed(const Duration(milliseconds: 500));
        
        uploaded += chunk;
        session.progress = uploaded / totalSize;
        session.speedBytesPerSec = (chunk * 2); // Mock speed calculation
        _progressController.add(session);
      }

      if (session.status != 'UPLOADING') return; // It was paused

      session.status = 'VERIFYING';
      _progressController.add(session);

      // 3. Complete and Verify
      final completeRes = await _api.dio.post('/creator_cloud/api/v1/ingest-sessions/${session.sessionId}/complete', data: {
        'parts': ['etag1', 'etag2'], // Mock parts
        'client_checksum': 'mock-sha256-hash-value', // This would come from the Isolate
        'card_id': cardId
      });

      session.verificationStatus = completeRes.data['verification_status']; // SAFE TO FORMAT
      session.status = 'COMPLETED';
      _progressController.add(session);

    } catch (e) {
      session.status = 'ERROR';
      _progressController.add(session);
      print('Ingest Error: $e');
    }
  }

  void pauseUpload(String sessionId) {
    if (_activeSessions.containsKey(sessionId)) {
      _activeSessions[sessionId]!.status = 'PAUSED';
      _progressController.add(_activeSessions[sessionId]!);
    }
  }

  void resumeUpload(String sessionId) {
    if (_activeSessions.containsKey(sessionId)) {
      // Logic to restart chunk loop from where it left off
      _activeSessions[sessionId]!.status = 'UPLOADING';
      _progressController.add(_activeSessions[sessionId]!);
      // startUpload(...) with offset
    }
  }
}
