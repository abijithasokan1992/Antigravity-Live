import 'package:flutter/material.dart';
import '../../core/api/dio_client.dart';

class PipelineBoard extends StatefulWidget {
  const PipelineBoard({super.key});

  @override
  State<PipelineBoard> createState() => _PipelineBoardState();
}

class _PipelineBoardState extends State<PipelineBoard> {
  bool _isLoading = true;
  String? _error;
  Map<String, dynamic> _columns = {};

  @override
  void initState() {
    super.initState();
    _fetchPipeline();
  }

  Future<void> _fetchPipeline() async {
    try {
      final response = await StreamVistaApiClient().dio.get('/phase1/pipeline');
      setState(() {
        _columns = response.data;
        _isLoading = false;
      });
    } catch (e) {
      setState(() {
        _error = e.toString();
        _isLoading = false;
      });
    }
  }

  @override
  Widget build(BuildContext context) {
    if (_isLoading) {
      return Container(
        height: 450,
        decoration: BoxDecoration(color: Colors.black, border: Border.all(color: Colors.white24)),
        child: const Center(child: CircularProgressIndicator(color: Colors.white)),
      );
    }

    if (_error != null) {
      return Container(
        height: 450,
        decoration: BoxDecoration(color: Colors.black, border: Border.all(color: Colors.red)),
        child: Center(child: Text('Error: $_error', style: const TextStyle(color: Colors.red))),
      );
    }

    // Ensure strict ordering
    final orderedColumns = [
      'Imported', 'Metadata Verified', 'Assets Received', 
      'QC Passed', 'Rights Structured', 'Docs Verified', 'Sellable'
    ];

    return Container(
      height: 450,
      decoration: BoxDecoration(
        color: Colors.black,
        border: Border.all(color: Colors.white24),
        borderRadius: BorderRadius.circular(4),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.stretch,
        children: [
          Container(
            padding: const EdgeInsets.all(16.0),
            decoration: const BoxDecoration(
              border: Border(bottom: BorderSide(color: Colors.white24)),
            ),
            child: const Text('PIPELINE BOARD (21 MIGRATED TITLES)', style: TextStyle(color: Colors.white, fontSize: 12, fontWeight: FontWeight.bold, letterSpacing: 1.5)),
          ),
          Expanded(
            child: SingleChildScrollView(
              scrollDirection: Axis.horizontal,
              padding: const EdgeInsets.all(16),
              child: Row(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: orderedColumns.map((c) => _buildColumn(c, _columns[c] ?? [])).toList(),
              ),
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildColumn(String name, List<dynamic> cards) {
    return Container(
      width: 280,
      margin: const EdgeInsets.only(right: 16),
      decoration: BoxDecoration(
        color: const Color(0xFF0A0A0A),
        border: Border.all(color: Colors.white12),
        borderRadius: BorderRadius.circular(4),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.stretch,
        children: [
          Container(
            padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 12),
            decoration: const BoxDecoration(
              border: Border(bottom: BorderSide(color: Colors.white12)),
            ),
            child: Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                Text(name.toUpperCase(), style: const TextStyle(color: Colors.white70, fontSize: 10, fontWeight: FontWeight.bold, letterSpacing: 1)),
                Container(
                  padding: const EdgeInsets.symmetric(horizontal: 6, vertical: 2),
                  decoration: BoxDecoration(color: Colors.white24, borderRadius: BorderRadius.circular(2)),
                  child: Text('${cards.length}', style: const TextStyle(color: Colors.white, fontSize: 10, fontWeight: FontWeight.bold)),
                )
              ],
            ),
          ),
          Expanded(
            child: ListView.builder(
              padding: const EdgeInsets.all(8),
              itemCount: cards.length,
              itemBuilder: (context, index) {
                final card = cards[index];
                return Container(
                  margin: const EdgeInsets.only(bottom: 8),
                  padding: const EdgeInsets.all(12),
                  decoration: BoxDecoration(
                    color: Colors.black,
                    border: Border.all(color: Colors.white24),
                    borderRadius: BorderRadius.circular(4),
                  ),
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Text(card['title']!, style: const TextStyle(color: Colors.white, fontSize: 12, fontWeight: FontWeight.bold)),
                      const SizedBox(height: 8),
                      Container(
                        padding: const EdgeInsets.symmetric(horizontal: 6, vertical: 4),
                        decoration: BoxDecoration(
                          color: Colors.white12,
                          border: Border.all(color: Colors.white24),
                          borderRadius: BorderRadius.circular(2),
                        ),
                        child: Row(
                          mainAxisSize: MainAxisSize.min,
                          children: [
                            const Icon(Icons.warning_amber_rounded, size: 10, color: Colors.white70),
                            const SizedBox(width: 4),
                            Flexible(
                              child: Text(
                                card['blocker']!.toUpperCase(),
                                style: const TextStyle(color: Colors.white70, fontSize: 9, fontWeight: FontWeight.bold, letterSpacing: 0.5),
                              ),
                            ),
                          ],
                        ),
                      )
                    ],
                  ),
                );
              },
            ),
          )
        ],
      ),
    );
  }
}
