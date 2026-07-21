// chunked_upload_engine.dart
// Direct-to-S3 Multipart Upload Engine
// Splits a local file into 50MB chunks, uploads them in parallel via presigned URLs,
// then notifies the backend to assemble the final object and kick off HLS proxy generation.

import 'dart:async';
import 'dart:io';
import 'dart:math';
import 'dart:collection';

import 'package:dio/dio.dart';
import 'package:flutter/material.dart';
import '../../core/api/dio_client.dart';

// ─────────────────────────────────────────────────────────────────────────────
// Constants
// ─────────────────────────────────────────────────────────────────────────────

const int _chunkSize = 50 * 1024 * 1024; // 50 MB per chunk
const int _maxParallelChunks = 3; // concurrent S3 PUT requests
const String _baseUrl = 'https://your-backend.example.com'; // TODO: replace

// ─────────────────────────────────────────────────────────────────────────────
// Data models
// ─────────────────────────────────────────────────────────────────────────────

class UploadedPart {
  final int partNumber;
  final String eTag;
  const UploadedPart({required this.partNumber, required this.eTag});
  Map<String, dynamic> toJson() => {'PartNumber': partNumber, 'ETag': eTag};
}

class UploadProgress {
  final int completedChunks;
  final int totalChunks;
  final double bytesUploaded;
  final double totalBytes;
  final String phase; // 'idle' | 'initiating' | 'uploading' | 'completing' | 'done' | 'error'
  final String? errorMessage;

  const UploadProgress({
    this.completedChunks = 0,
    this.totalChunks = 0,
    this.bytesUploaded = 0,
    this.totalBytes = 0,
    this.phase = 'idle',
    this.errorMessage,
  });

  double get fraction =>
      totalBytes == 0 ? 0 : (bytesUploaded / totalBytes).clamp(0.0, 1.0);

  UploadProgress copyWith({
    int? completedChunks,
    int? totalChunks,
    double? bytesUploaded,
    double? totalBytes,
    String? phase,
    String? errorMessage,
  }) =>
      UploadProgress(
        completedChunks: completedChunks ?? this.completedChunks,
        totalChunks: totalChunks ?? this.totalChunks,
        bytesUploaded: bytesUploaded ?? this.bytesUploaded,
        totalBytes: totalBytes ?? this.totalBytes,
        phase: phase ?? this.phase,
        errorMessage: errorMessage,
      );
}

// ─────────────────────────────────────────────────────────────────────────────
// ChunkedUploadEngine
// ─────────────────────────────────────────────────────────────────────────────

class ChunkedUploadEngine {
  ChunkedUploadEngine();

  Future<String> upload({
    required File file,
    required String titleId,
    required void Function(UploadProgress) onProgress,
  }) async {
    final fileSize = await file.length();
    final fileName = file.path.split('/').last;
    final totalChunks = (fileSize / _chunkSize).ceil();

    UploadProgress progress = UploadProgress(
      totalChunks: totalChunks,
      totalBytes: fileSize.toDouble(),
      phase: 'initiating',
    );
    onProgress(progress);

    final initiateRes = await _post('/api/upload/initiate', {
      'title_id': titleId,
      'file_name': fileName,
      'file_size': fileSize,
      'total_parts': totalChunks,
      'content_type': _inferContentType(fileName),
    });

    final uploadId = initiateRes['upload_id'] as String;
    final s3Key = initiateRes['s3_key'] as String;
    final mediaAssetId = initiateRes['media_asset_id'] as String;

    progress = progress.copyWith(phase: 'uploading');
    onProgress(progress);

    final completedParts = <UploadedPart>[];
    double uploaded = 0;
    final semaphore = _Semaphore(_maxParallelChunks);

    final futures = <Future<void>>[];

    for (int i = 0; i < totalChunks; i++) {
      final partNumber = i + 1;
      final start = i * _chunkSize;
      final end = min(start + _chunkSize, fileSize);
      final chunkLength = end - start;

      futures.add(semaphore.run(() async {
        final signRes = await _post('/api/upload/presign-chunk', {
          'upload_id': uploadId,
          's3_key': s3Key,
          'part_number': partNumber,
        });
        final presignedUrl = signRes['presigned_url'] as String;

        final raf = await file.open();
        await raf.setPosition(start);
        final bytes = await raf.read(chunkLength);
        await raf.close();

        final response = await StreamVistaApiClient().dio.put(
          presignedUrl,
          data: Stream.fromIterable([bytes]),
          options: Options(
            headers: {
              'Content-Length': chunkLength,
              'Content-Type': 'application/octet-stream',
            },
          ),
        );

        final eTag = (response.headers.value('etag') ?? '').replaceAll('"', '');
        completedParts.add(UploadedPart(partNumber: partNumber, eTag: eTag));
        uploaded += chunkLength;

        progress = progress.copyWith(
          completedChunks: completedParts.length,
          bytesUploaded: uploaded,
        );
        onProgress(progress);
      }));
    }

    await Future.wait(futures);

    progress = progress.copyWith(phase: 'completing');
    onProgress(progress);

    completedParts.sort((a, b) => a.partNumber.compareTo(b.partNumber));

    await _post('/api/upload/complete', {
      'upload_id': uploadId,
      's3_key': s3Key,
      'media_asset_id': mediaAssetId,
      'title_id': titleId,
      'parts': completedParts.map((p) => p.toJson()).toList(),
    });

    progress = progress.copyWith(phase: 'done', bytesUploaded: fileSize.toDouble());
    onProgress(progress);

    return mediaAssetId;
  }

  Future<Map<String, dynamic>> _post(String endpoint, Map<String, dynamic> body) async {
    final res = await StreamVistaApiClient().dio.post(
      endpoint,
      data: body,
    );
    if (res.statusCode != 200 && res.statusCode != 201) {
      throw Exception('Backend error $endpoint: ${res.statusCode}');
    }
    return res.data as Map<String, dynamic>;
  }

  String _inferContentType(String fileName) {
    if (fileName.endsWith('.mp4')) return 'video/mp4';
    if (fileName.endsWith('.mov')) return 'video/quicktime';
    return 'application/octet-stream';
  }
}

class _Semaphore {
  final int maxCount;
  int _count = 0;
  final Queue<Completer<void>> _waitQueue = Queue();

  _Semaphore(this.maxCount);

  Future<void> run(Future<void> Function() task) async {
    await _acquire();
    try {
      await task();
    } finally {
      _release();
    }
  }

  Future<void> _acquire() async {
    if (_count < maxCount) {
      _count++;
      return;
    }
    final c = Completer<void>();
    _waitQueue.add(c);
    await c.future;
    _count++;
  }

  void _release() {
    _count--;
    if (_waitQueue.isNotEmpty) {
      final next = _waitQueue.removeFirst();
      next.complete();
    }
  }
}

class ChunkedUploadWidget extends StatefulWidget {
  final String titleId;

  const ChunkedUploadWidget({super.key, required this.titleId});

  @override
  State<ChunkedUploadWidget> createState() => _ChunkedUploadWidgetState();
}

class _ChunkedUploadWidgetState extends State<ChunkedUploadWidget> {
  UploadProgress _progress = const UploadProgress();
  File? _selectedFile;

  Future<void> _pickAndUpload() async {
    final picked = File('/path/to/demo_master.mp4');
    setState(() => _selectedFile = picked);

    final engine = ChunkedUploadEngine();
    try {
      await engine.upload(
        file: picked,
        titleId: widget.titleId,
        onProgress: (p) => setState(() => _progress = p),
      );
    } catch (e) {
      setState(() => _progress = _progress.copyWith(phase: 'error', errorMessage: e.toString()));
    }
  }

  @override
  Widget build(BuildContext context) {
    final isDone = _progress.phase == 'done';
    final isError = _progress.phase == 'error';
    final isIdle = _progress.phase == 'idle';

    return Card(
      color: Colors.black,
      shape: RoundedRectangleBorder(
        borderRadius: BorderRadius.circular(8),
        side: const BorderSide(color: Colors.white24),
      ),
      child: Padding(
        padding: const EdgeInsets.all(24),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            const Text(
              'MASTER UPLOAD',
              style: TextStyle(color: Colors.white, fontSize: 11, fontWeight: FontWeight.w700, letterSpacing: 2),
            ),
            const SizedBox(height: 16),
            if (_selectedFile != null)
              Text(_selectedFile!.path.split('/').last, style: const TextStyle(color: Colors.white70, fontSize: 13)),
            const SizedBox(height: 12),
            if (!isIdle) ...[
              ClipRRect(
                borderRadius: BorderRadius.circular(2),
                child: LinearProgressIndicator(
                  value: _progress.fraction,
                  backgroundColor: Colors.white12,
                  valueColor: AlwaysStoppedAnimation<Color>(isError ? Colors.red : Colors.white),
                  minHeight: 4,
                ),
              ),
              const SizedBox(height: 8),
              Row(
                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                children: [
                  Text(
                    _phaseLabel(_progress.phase),
                    style: TextStyle(color: isError ? Colors.red : Colors.white54, fontSize: 11, letterSpacing: 1),
                  ),
                  if (!isError)
                    Text('${_progress.completedChunks} / ${_progress.totalChunks} chunks', style: const TextStyle(color: Colors.white38, fontSize: 11)),
                ],
              ),
              if (isError && _progress.errorMessage != null) ...[
                const SizedBox(height: 6),
                Text(_progress.errorMessage!, style: const TextStyle(color: Colors.red, fontSize: 11)),
              ],
              const SizedBox(height: 16),
            ],
            SizedBox(
              width: double.infinity,
              child: OutlinedButton(
                style: OutlinedButton.styleFrom(
                  side: BorderSide(color: isDone ? Colors.white38 : Colors.white),
                  foregroundColor: isDone ? Colors.white38 : Colors.white,
                  padding: const EdgeInsets.symmetric(vertical: 14),
                  shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(4)),
                ),
                onPressed: (isDone || _progress.phase == 'uploading' || _progress.phase == 'completing') ? null : _pickAndUpload,
                child: Text(
                  isDone ? '✓  UPLOAD COMPLETE' : isError ? 'RETRY UPLOAD' : 'SELECT & UPLOAD MASTER FILE',
                  style: const TextStyle(fontSize: 11, fontWeight: FontWeight.w600, letterSpacing: 1.5),
                ),
              ),
            ),
          ],
        ),
      ),
    );
  }

  String _phaseLabel(String phase) {
    const labels = {
      'initiating': 'INITIATING UPLOAD...',
      'uploading': 'UPLOADING TO CLOUD...',
      'completing': 'ASSEMBLING & QUEUEING PROXY...',
      'done': 'COMPLETE',
      'error': 'UPLOAD FAILED',
    };
    return labels[phase] ?? phase.toUpperCase();
  }
}
