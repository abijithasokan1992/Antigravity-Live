import 'package:flutter/material.dart';

class QCChecklistPanel extends StatefulWidget {
  final String titleId;
  final VoidCallback onSubmit;

  const QCChecklistPanel({super.key, required this.titleId, required this.onSubmit});

  @override
  State<QCChecklistPanel> createState() => _QCChecklistPanelState();
}

class _QCChecklistPanelState extends State<QCChecklistPanel> {
  // Main Master Inspection
  bool _audioSync = false;
  bool _aspectRatio = false;
  bool _noSlates = false;
  bool _durationMatch = false;

  // Secondary Assets
  bool _subsTiming = false;
  bool _censorCert = false;
  bool _metadataComplete = false;

  bool get _isAllChecked =>
      _audioSync && _aspectRatio && _noSlates && _durationMatch &&
      _subsTiming && _censorCert && _metadataComplete;

  @override
  Widget build(BuildContext context) {
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
              'OPERATOR QC CHECKLIST',
              style: TextStyle(color: Colors.white, fontSize: 14, fontWeight: FontWeight.bold, letterSpacing: 1.5),
            ),
            const SizedBox(height: 8),
            const Text(
              'Strictly verify all master parameters before platform delivery.',
              style: TextStyle(color: Colors.white54, fontSize: 12),
            ),
            const Divider(color: Colors.white24, height: 32),
            
            // Section 1
            const Text('MAIN MASTER INSPECTION', style: TextStyle(color: Colors.white70, fontSize: 12, fontWeight: FontWeight.bold)),
            const SizedBox(height: 8),
            _buildCheckTile('Perfect Audio Sync (Lip-sync & Stems)', _audioSync, (val) => setState(() => _audioSync = val!)),
            _buildCheckTile('Correct Aspect Ratio / No Pillarboxing', _aspectRatio, (val) => setState(() => _aspectRatio = val!)),
            _buildCheckTile('No Burned-in Slates or Timecodes', _noSlates, (val) => setState(() => _noSlates = val!)),
            _buildCheckTile('Duration exactly matches Metadata', _durationMatch, (val) => setState(() => _durationMatch = val!)),
            
            const SizedBox(height: 16),
            
            // Section 2
            const Text('SECONDARY ASSETS & LEGAL', style: TextStyle(color: Colors.white70, fontSize: 12, fontWeight: FontWeight.bold)),
            const SizedBox(height: 8),
            _buildCheckTile('Subtitles & Captions timing verified', _subsTiming, (val) => setState(() => _subsTiming = val!)),
            _buildCheckTile('Censor Certificate uploaded & verified', _censorCert, (val) => setState(() => _censorCert = val!)),
            _buildCheckTile('Metadata & Artwork High-Res Complete', _metadataComplete, (val) => setState(() => _metadataComplete = val!)),
            
            const SizedBox(height: 24),
            
            // Submit Button
            SizedBox(
              width: double.infinity,
              child: ElevatedButton(
                style: ElevatedButton.styleFrom(
                  backgroundColor: _isAllChecked ? Colors.white : Colors.white12,
                  foregroundColor: _isAllChecked ? Colors.black : Colors.white54,
                  padding: const EdgeInsets.symmetric(vertical: 16),
                  shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(4)),
                ),
                onPressed: _isAllChecked ? widget.onSubmit : null,
                child: Text(
                  _isAllChecked ? 'APPROVE MASTER FOR DELIVERY' : 'COMPLETE ALL CHECKS TO APPROVE',
                  style: const TextStyle(fontWeight: FontWeight.bold, letterSpacing: 1),
                ),
              ),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildCheckTile(String title, bool value, ValueChanged<bool?> onChanged) {
    return CheckboxListTile(
      title: Text(title, style: const TextStyle(color: Colors.white, fontSize: 13)),
      value: value,
      onChanged: onChanged,
      activeColor: Colors.white,
      checkColor: Colors.black,
      side: const BorderSide(color: Colors.white54),
      controlAffinity: ListTileControlAffinity.leading,
      contentPadding: EdgeInsets.zero,
      dense: true,
    );
  }
}
