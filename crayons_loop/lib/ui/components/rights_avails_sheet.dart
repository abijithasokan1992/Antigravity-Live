import 'package:flutter/material.dart';
import '../../core/api/dio_client.dart';

class RightsAvailsSheet extends StatefulWidget {
  final String titleId;
  final bool isEmpty;

  const RightsAvailsSheet({super.key, required this.titleId, this.isEmpty = false});

  @override
  State<RightsAvailsSheet> createState() => _RightsAvailsSheetState();
}

class _RightsAvailsSheetState extends State<RightsAvailsSheet> {
  bool _isLoading = true;
  String? _error;
  List<dynamic> _rows = [];

  @override
  void initState() {
    super.initState();
    if (!widget.isEmpty) {
      _fetchRights();
    } else {
      _isLoading = false;
    }
  }

  Future<void> _fetchRights() async {
    try {
      final response = await StreamVistaApiClient().dio.get('/phase1/titles/${widget.titleId}/rights');
      setState(() {
        _rows = response.data;
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
    if (widget.isEmpty || (!_isLoading && _rows.isEmpty && _error == null)) {
      return Container(
        height: 300,
        width: double.infinity,
        decoration: BoxDecoration(
          color: Colors.black,
          border: Border.all(color: Colors.white24),
          borderRadius: BorderRadius.circular(4),
        ),
        child: const Center(
          child: Text(
            'Missing Structural Rights – Rights Holder owes completion',
            style: TextStyle(color: Colors.white54, fontSize: 13, fontWeight: FontWeight.bold, letterSpacing: 1),
          ),
        ),
      );
    }

    if (_isLoading) {
      return Container(
        height: 300,
        decoration: BoxDecoration(color: Colors.black, border: Border.all(color: Colors.white24)),
        child: const Center(child: CircularProgressIndicator(color: Colors.white)),
      );
    }

    if (_error != null) {
      return Container(
        height: 300,
        decoration: BoxDecoration(color: Colors.black, border: Border.all(color: Colors.red)),
        child: Center(child: Text('Error: $_error', style: const TextStyle(color: Colors.red))),
      );
    }

    return Container(
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
            child: Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                const Text('STRUCTURED RIGHTS AVAILABILITY', style: TextStyle(color: Colors.white, fontSize: 12, fontWeight: FontWeight.bold, letterSpacing: 1.5)),
                OutlinedButton.icon(
                  onPressed: () {},
                  icon: const Icon(Icons.edit, size: 14, color: Colors.white),
                  label: const Text('EDIT RIGHTS', style: TextStyle(color: Colors.white, fontSize: 10, letterSpacing: 1)),
                  style: OutlinedButton.styleFrom(
                    side: const BorderSide(color: Colors.white24),
                    shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(2)),
                  ),
                )
              ],
            ),
          ),
          SingleChildScrollView(
            scrollDirection: Axis.horizontal,
            child: DataTable(
              headingTextStyle: const TextStyle(color: Colors.white, fontWeight: FontWeight.bold, fontSize: 11, letterSpacing: 1),
              dataTextStyle: const TextStyle(color: Colors.white70, fontSize: 12),
              dividerThickness: 1,
              columns: const [
                DataColumn(label: Text('TERRITORY')),
                DataColumn(label: Text('MEDIA')),
                DataColumn(label: Text('EXCLUSIVE')),
                DataColumn(label: Text('AVAILABLE')),
                DataColumn(label: Text('DEAL TYPE')),
                DataColumn(label: Text('WINDOW START')),
                DataColumn(label: Text('WINDOW END')),
                DataColumn(label: Text('NOTES')),
              ],
              rows: _rows.map((r) {
                final isAvail = r['is_available'] == true;
                return DataRow(
                  cells: [
                    DataCell(Text(r['territory_iso'] ?? '', style: const TextStyle(fontWeight: FontWeight.bold, color: Colors.white))),
                    DataCell(Text((r['media_type'] ?? '').toString().toUpperCase())),
                    DataCell(Text(r['is_exclusive'] ? 'YES' : 'NO')),
                    DataCell(
                      Container(
                        padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 2),
                        decoration: BoxDecoration(
                          color: isAvail ? Colors.white : Colors.transparent,
                          border: Border.all(color: isAvail ? Colors.white : Colors.white24),
                          borderRadius: BorderRadius.circular(2),
                        ),
                        child: Text(isAvail ? 'AVAILABLE' : 'EXCLUDED', style: TextStyle(color: isAvail ? Colors.black : Colors.white54, fontSize: 10, fontWeight: FontWeight.bold)),
                      )
                    ),
                    DataCell(Text(r['deal_structure'] ?? '')),
                    DataCell(Text(r['window_start'] ?? '')),
                    DataCell(Text(r['window_end'] ?? 'Perpetual')),
                    DataCell(Text(r['notes'] ?? '', style: const TextStyle(color: Colors.white54, fontStyle: FontStyle.italic))),
                  ],
                );
              }).toList(),
            ),
          ),
        ],
      ),
    );
  }
}
