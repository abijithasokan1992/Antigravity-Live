import 'dart:async';
import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import '../../core/api/dio_client.dart';

// ─────────────────────────────────────────────────────────────────────────────
// Config
// ─────────────────────────────────────────────────────────────────────────────

const String _baseUrl = 'https://your-backend.example.com'; // TODO: replace

// ─────────────────────────────────────────────────────────────────────────────
// Shared API helper
// ─────────────────────────────────────────────────────────────────────────────

class _Api {
  static Dio _dio(String token) => Dio(BaseOptions(
        baseUrl: _baseUrl,
        headers: {'Authorization': 'Bearer $token'},
        connectTimeout: const Duration(seconds: 20),
        receiveTimeout: const Duration(seconds: 30),
  static Future<Map<String, dynamic>> post(
    String path,
    Map<String, dynamic> body,
    String token,
  ) async {
    try {
      final res = await StreamVistaApiClient().dio.post(path, data: body);
      return res.data;
    } catch (e) {
      if (e is DioException) throw Exception(e.response?.data['error'] ?? e.message);
      rethrow;
    }
  }

  static Future<Map<String, dynamic>> get(String path, String token) async {
    try {
      final res = await StreamVistaApiClient().dio.get(path);
      return res.data;
    } catch (e) {
      if (e is DioException) throw Exception(e.response?.data['error'] ?? e.message);
      rethrow;
    }
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// Shared monochrome text styles
// ─────────────────────────────────────────────────────────────────────────────

const _header = TextStyle(
  color: Colors.white,
  fontSize: 11,
  fontWeight: FontWeight.w700,
  letterSpacing: 2,
);

const _body = TextStyle(color: Colors.white, fontSize: 12);

const _muted = TextStyle(color: Colors.white54, fontSize: 11);

const _label = TextStyle(
  color: Colors.white70,
  fontSize: 10,
  fontWeight: FontWeight.w700,
  letterSpacing: 1.5,
);

// ─────────────────────────────────────────────────────────────────────────────
// STATUS BADGE
// ─────────────────────────────────────────────────────────────────────────────

class _StatusBadge extends StatelessWidget {
  final String label;
  final bool filled;
  const _StatusBadge(this.label, {this.filled = false});

  @override
  Widget build(BuildContext context) => Container(
        padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 3),
        decoration: BoxDecoration(
          color: filled ? Colors.white : Colors.transparent,
          border: Border.all(color: filled ? Colors.white : Colors.white38),
          borderRadius: BorderRadius.circular(2),
        ),
        child: Text(
          label,
          style: TextStyle(
            color: filled ? Colors.black : Colors.white54,
            fontSize: 9,
            fontWeight: FontWeight.w700,
            letterSpacing: 1.5,
          ),
        ),
      );
}

// =============================================================================
// WIDGET 1: DELIVERABLES BUNDLE EXPORTER PANEL
// =============================================================================

class DeliveryExporterPanel extends StatefulWidget {
  final String titleId;
  final String titleName;

  const DeliveryExporterPanel({
    super.key,
    required this.titleId,
    required this.titleName,
  });

  @override
  State<DeliveryExporterPanel> createState() => _DeliveryExporterPanelState();
}

class _DeliveryExporterPanelState extends State<DeliveryExporterPanel> {
  static const _channels = ['Sun NXT', 'Amazon Prime', 'Zee5', 'BookMyShow'];
  static const _dealTypes = ['Revenue Share (80/20)', 'Fixed Fee (MG)'];

  String _channel = 'Sun NXT';
  String _dealType = 'Revenue Share (80/20)';
  bool _isGenerating = false;
  String? _error;

  // Generated manifest state
  String? _manifestId;
  String? _manifestSku;
  String? _manifestStatus;
  String? _downloadUrl;
  Timer? _pollTimer;

  @override
  void dispose() {
    _pollTimer?.cancel();
    super.dispose();
  }

  Future<void> _buildBundle() async {
    setState(() {
      _isGenerating = true;
      _error = null;
      _manifestId = null;
      _manifestSku = null;
      _manifestStatus = null;
      _downloadUrl = null;
    });

    try {
      final res = await _Api.post(
        '/api/v1/deliveries/package',
        {
          'title_id': widget.titleId,
          'channel_name': _channel,
          'deal_type': _dealType.contains('Fixed') ? 'fixed_fee' : 'revenue_share',
        },
        '',
      );

      final manifest = res['manifest'] as Map<String, dynamic>;
      setState(() {
        _manifestId     = manifest['id'] as String?;
        _manifestSku    = manifest['manifest_sku'] as String?;
        _manifestStatus = manifest['status'] as String? ?? 'generating';
      });

      // Poll every 3 s until ready
      _pollTimer = Timer.periodic(const Duration(seconds: 3), (_) => _pollStatus());
    } catch (e) {
      setState(() => _error = _parseError(e));
    } finally {
      setState(() => _isGenerating = false);
    }
  }

  Future<void> _pollStatus() async {
    if (_manifestId == null) return;
    try {
      final res = await _Api.get(
        '/api/v1/deliveries/manifest/$_manifestId',
        '',
      );
      final status = res['status'] as String? ?? 'generating';
      final url    = res['download_url'] as String?;
      setState(() {
        _manifestStatus = status;
        _downloadUrl    = url;
      });
      if (status == 'ready' || status == 'failed') {
        _pollTimer?.cancel();
      }
    } catch (_) {}
  }

  String _parseError(dynamic e) {
    if (e is DioException) {
      final data = e.response?.data;
      if (data is Map) return data['error'] as String? ?? e.message ?? 'Unknown error';
    }
    return e.toString();
  }

  @override
  Widget build(BuildContext context) {
    return _Panel(
      title: 'DELIVERABLES MANIFEST EXPORTER',
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          // Title label
          Text(widget.titleName.toUpperCase(), style: _muted),
          const SizedBox(height: 16),

          // Channel selector
          _Dropdown(
            label: 'TARGET CHANNEL',
            value: _channel,
            items: _channels,
            onChanged: (v) => setState(() => _channel = v),
          ),
          const SizedBox(height: 12),

          // Deal type selector
          _Dropdown(
            label: 'DEAL TYPE',
            value: _dealType,
            items: _dealTypes,
            onChanged: (v) => setState(() => _dealType = v),
          ),
          const SizedBox(height: 20),

          // Action button
          _WideButton(
            label: 'BUILD S3 DELIVERY BUNDLE (.ZIP)',
            loading: _isGenerating || _manifestStatus == 'generating',
            loadingLabel: 'ASSEMBLING BUNDLE...',
            disabled: _manifestStatus == 'ready',
            onPressed: _buildBundle,
          ),

          // Status / result block
          if (_manifestStatus != null) ...[
            const SizedBox(height: 16),
            _buildResultCard(),
          ],

          // Error
          if (_error != null) ...[
            const SizedBox(height: 12),
            Text(_error!, style: const TextStyle(color: Colors.red, fontSize: 11)),
          ],
        ],
      ),
    );
  }

  Widget _buildResultCard() {
    final isReady  = _manifestStatus == 'ready';
    final isFailed = _manifestStatus == 'failed';

    return Container(
      padding: const EdgeInsets.all(14),
      decoration: BoxDecoration(
        border: Border.all(color: Colors.white12),
        borderRadius: BorderRadius.circular(4),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(children: [
            _StatusBadge(
              _manifestStatus!.toUpperCase(),
              filled: isReady,
            ),
            if (_manifestSku != null) ...[
              const SizedBox(width: 12),
              Expanded(
                child: Text(_manifestSku!, style: _muted, overflow: TextOverflow.ellipsis),
              ),
              IconButton(
                icon: const Icon(Icons.copy, color: Colors.white38, size: 14),
                onPressed: () => Clipboard.setData(ClipboardData(text: _manifestSku!)),
                padding: EdgeInsets.zero,
                constraints: const BoxConstraints(),
                tooltip: 'Copy SKU',
              ),
            ],
          ]),

          if (isReady && _downloadUrl != null) ...[
            const SizedBox(height: 12),
            _WideButton(
              label: 'DOWNLOAD DELIVERY ZIP',
              onPressed: () {
                // In production use url_launcher: launchUrl(Uri.parse(_downloadUrl!))
              },
            ),
          ],

          if (isFailed)
            const Padding(
              padding: EdgeInsets.only(top: 8),
              child: Text(
                'Bundle generation failed. Check backend logs.',
                style: TextStyle(color: Colors.red, fontSize: 11),
              ),
            ),

          if (_manifestStatus == 'generating')
            const Padding(
              padding: EdgeInsets.only(top: 12),
              child: LinearProgressIndicator(
                backgroundColor: Colors.white12,
                valueColor: AlwaysStoppedAnimation<Color>(Colors.white38),
                minHeight: 2,
              ),
            ),
        ],
      ),
    );
  }
}

// =============================================================================
// WIDGET 2: FINANCIAL LEDGER & PAYOUT PANEL
// =============================================================================

class FinancialLedgerPanel extends StatefulWidget {
  final String titleId;
  final String creatorPartyId;

  const FinancialLedgerPanel({
    super.key,
    required this.titleId,
    required this.creatorPartyId,
  });

  @override
  State<FinancialLedgerPanel> createState() => _FinancialLedgerPanelState();
}

class _FinancialLedgerPanelState extends State<FinancialLedgerPanel>
    with SingleTickerProviderStateMixin {
  late TabController _tabCtrl;
  bool _loading = true;
  String? _error;

  List<Map<String, dynamic>> _ledger = [];
  Map<String, dynamic> _summary = {};
  Map<String, dynamic> _balance = {};

  @override
  void initState() {
    super.initState();
    _tabCtrl = TabController(length: 2, vsync: this);
    _load();
  }

  Future<void> _load() async {
    setState(() { _loading = true; _error = null; });
    try {
      final results = await Future.wait([
        _Api.get('/api/v1/financials/ledger/${widget.titleId}', ''),
        _Api.get('/api/v1/financials/balance/${widget.creatorPartyId}', ''),
      ]);
      final ledgerRes  = results[0];
      final balanceRes = results[1];

      setState(() {
        _ledger  = List<Map<String, dynamic>>.from(ledgerRes['ledger'] ?? []);
        _summary = Map<String, dynamic>.from(ledgerRes['summary'] ?? {});
        _balance = Map<String, dynamic>.from(balanceRes);
      });
    } catch (e) {
      setState(() => _error = e.toString());
    } finally {
      setState(() => _loading = false);
    }
  }

  void _openPayoutDialog() {
    showDialog(
      context: context,
      builder: (_) => PayoutRequestDialog(
        creatorPartyId: widget.creatorPartyId,
        availableBalance: double.tryParse(_balance['available_balance']?.toString() ?? '0') ?? 0,
        onSuccess: _load,
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    if (_loading) {
      return const _Panel(
        title: 'REVENUE LEDGER & PAYOUTS',
        child: Center(
          child: Padding(
            padding: EdgeInsets.all(32),
            child: CircularProgressIndicator(color: Colors.white38, strokeWidth: 2),
          ),
        ),
      );
    }

    if (_error != null) {
      return _Panel(
        title: 'REVENUE LEDGER & PAYOUTS',
        child: Text(_error!, style: const TextStyle(color: Colors.red, fontSize: 11)),
      );
    }

    final estimated = _ledger.where((r) => r['statement_status'] == 'estimated').toList();
    final reconciled = _ledger.where((r) => r['statement_status'] == 'reconciled').toList();

    return _Panel(
      title: 'REVENUE LEDGER & PAYOUTS',
      trailing: OutlinedButton(
        style: OutlinedButton.styleFrom(
          side: const BorderSide(color: Colors.white38),
          foregroundColor: Colors.white,
          padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
          shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(2)),
        ),
        onPressed: _openPayoutDialog,
        child: const Text('REQUEST PAYOUT', style: TextStyle(fontSize: 10, fontWeight: FontWeight.w700, letterSpacing: 1.5)),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          // Balance summary row
          _buildBalanceSummary(),
          const SizedBox(height: 20),

          // Tab bar
          TabBar(
            controller: _tabCtrl,
            indicatorColor: Colors.white,
            labelColor: Colors.white,
            unselectedLabelColor: Colors.white38,
            indicatorSize: TabBarIndicatorSize.label,
            labelStyle: const TextStyle(fontSize: 10, fontWeight: FontWeight.w700, letterSpacing: 1.5),
            tabs: [
              Tab(text: 'ESTIMATES (${estimated.length})'),
              Tab(text: 'RECONCILED (${reconciled.length})'),
            ],
          ),
          const Divider(color: Colors.white12, height: 1),
          const SizedBox(height: 12),

          SizedBox(
            height: 260,
            child: TabBarView(
              controller: _tabCtrl,
              children: [
                _buildLedgerTable(estimated, isEstimated: true),
                _buildLedgerTable(reconciled, isEstimated: false),
              ],
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildBalanceSummary() {
    final available = _summary['available_balance']?.toString() ?? '—';
    final estimated = _summary['total_estimated']?.toString() ?? '—';
    final reconciled = _summary['total_reconciled']?.toString() ?? '—';
    final paid = _summary['total_paid']?.toString() ?? '—';

    return Row(
      children: [
        _BalanceTile(label: 'AVAILABLE', value: '₹ $available', primary: true),
        const SizedBox(width: 16),
        _BalanceTile(label: 'ESTIMATED', value: '₹ $estimated'),
        const SizedBox(width: 16),
        _BalanceTile(label: 'RECONCILED', value: '₹ $reconciled'),
        const SizedBox(width: 16),
        _BalanceTile(label: 'PAID OUT', value: '₹ $paid'),
      ],
    );
  }

  Widget _buildLedgerTable(List<Map<String, dynamic>> rows, {required bool isEstimated}) {
    if (rows.isEmpty) {
      return Center(
        child: Text(
          isEstimated ? 'No estimated statements yet.' : 'No reconciled statements yet.',
          style: _muted,
        ),
      );
    }

    return SingleChildScrollView(
      child: Table(
        border: TableBorder.all(color: Colors.white12),
        columnWidths: const {
          0: FlexColumnWidth(2.5),
          1: FlexColumnWidth(1.8),
          2: FlexColumnWidth(1.8),
          3: FlexColumnWidth(2),
          4: FlexColumnWidth(1.2),
        },
        children: [
          TableRow(
            decoration: const BoxDecoration(color: Color(0xFF111111)),
            children: [
              _TH('CHANNEL'),
              _TH('GROSS (${rows.firstOrNull?['currency'] ?? 'INR'})'),
              _TH('NET SHARE'),
              _TH('PERIOD'),
              _TH('DEAL TYPE'),
            ],
          ),
          ...rows.map((r) {
            final gross = _fmt(r['gross_revenue']);
            final net   = _fmt(r['net_creator_share']);
            final start = (r['reporting_period_start'] as String? ?? '').substring(0, 7);
            final end   = (r['reporting_period_end']   as String? ?? '').substring(0, 7);
            final deal  = (r['deal_type'] as String? ?? '').replaceAll('_', ' ').toUpperCase();

            return TableRow(
              children: [
                _TD(r['channel_name']?.toString() ?? '—'),
                _TD('₹ $gross'),
                _TD('₹ $net'),
                _TD('$start → $end'),
                _TD(deal, muted: true),
              ],
            );
          }),
        ],
      ),
    );
  }

  String _fmt(dynamic v) {
    if (v == null) return '0.00';
    final n = double.tryParse(v.toString()) ?? 0.0;
    return n.toStringAsFixed(2).replaceAllMapped(
      RegExp(r'(\d)(?=(\d{3})+(?!\d))'),
      (m) => '${m[1]},',
    );
  }

  @override
  void dispose() {
    _tabCtrl.dispose();
    super.dispose();
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// Table cell helpers
// ─────────────────────────────────────────────────────────────────────────────

Widget _TH(String t) => Padding(
      padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 8),
      child: Text(t, style: _label),
    );

Widget _TD(String t, {bool muted = false}) => Padding(
      padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 8),
      child: Text(t, style: muted ? _muted : _body),
    );

// =============================================================================
// PAYOUT REQUEST DIALOG
// =============================================================================

class PayoutRequestDialog extends StatefulWidget {
  final String creatorPartyId;
  final double availableBalance;
  final VoidCallback? onSuccess;

  const PayoutRequestDialog({
    super.key,
    required this.creatorPartyId,
    required this.availableBalance,
    this.onSuccess,
  });

  @override
  State<PayoutRequestDialog> createState() => _PayoutRequestDialogState();
}

class _PayoutRequestDialogState extends State<PayoutRequestDialog> {
  final _amountCtrl = TextEditingController();
  String _method = 'bank_wire';
  bool _submitting = false;
  String? _error;
  bool _done = false;
  double? _remainingBalance;

  static const _methods = {
    'bank_wire': 'Bank Wire Transfer',
    'upi': 'UPI',
    'paypal': 'PayPal',
    'razorpay_transfer': 'Razorpay',
  };

  Future<void> _submit() async {
    final amount = double.tryParse(_amountCtrl.text.trim());
    if (amount == null || amount <= 0) {
      setState(() => _error = 'Enter a valid positive amount.');
      return;
    }
    if (amount > widget.availableBalance) {
      setState(() => _error = 'Amount exceeds available balance of ₹${widget.availableBalance.toStringAsFixed(2)}');
      return;
    }

    setState(() { _submitting = true; _error = null; });

    try {
      final res = await StreamVistaApiClient().dio.post(
        '/api/v1/financials/request-payout',
        data: {
          'party_id': widget.creatorPartyId,
          'amount': amount,
          'payout_method': _method,
          'ledger_ids': [],
        },
      );
      setState(() {
        _done = true;
        _remainingBalance = double.tryParse(res.data['remaining_balance']?.toString() ?? '');
      });
      widget.onSuccess?.call();
    } catch (e) {
      setState(() => _error = e.toString());
    } finally {
      setState(() => _submitting = false);
    }
  }

  @override
  Widget build(BuildContext context) {
    return Dialog(
      backgroundColor: Colors.black,
      shape: RoundedRectangleBorder(
        borderRadius: BorderRadius.circular(4),
        side: const BorderSide(color: Colors.white12),
      ),
      child: Padding(
        padding: const EdgeInsets.all(24),
        child: _done ? _buildSuccess() : _buildForm(),
      ),
    );
  }

  Widget _buildForm() => Column(
        mainAxisSize: MainAxisSize.min,
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          const Text('REQUEST PAYOUT', style: _header),
          const SizedBox(height: 4),
          Text(
            'Available balance: ₹${widget.availableBalance.toStringAsFixed(2)}',
            style: _muted,
          ),
          const SizedBox(height: 20),

          // Amount field
          TextField(
            controller: _amountCtrl,
            style: const TextStyle(color: Colors.white, fontSize: 14),
            keyboardType: const TextInputType.numberWithOptions(decimal: true),
            inputFormatters: [
              FilteringTextInputFormatter.allow(RegExp(r'[0-9.]')),
            ],
            decoration: const InputDecoration(
              labelText: 'AMOUNT (INR)',
              labelStyle: TextStyle(color: Colors.white38, fontSize: 10, letterSpacing: 1.5),
              prefixText: '₹  ',
              prefixStyle: TextStyle(color: Colors.white70),
              enabledBorder: OutlineInputBorder(borderSide: BorderSide(color: Colors.white12)),
              focusedBorder: OutlineInputBorder(borderSide: BorderSide(color: Colors.white38)),
              contentPadding: EdgeInsets.symmetric(horizontal: 14, vertical: 12),
            ),
          ),
          const SizedBox(height: 14),

          // Method selector
          DropdownButtonFormField<String>(
            value: _method,
            dropdownColor: const Color(0xFF111111),
            style: const TextStyle(color: Colors.white, fontSize: 13),
            decoration: const InputDecoration(
              labelText: 'PAYOUT METHOD',
              labelStyle: TextStyle(color: Colors.white38, fontSize: 10, letterSpacing: 1.5),
              enabledBorder: OutlineInputBorder(borderSide: BorderSide(color: Colors.white12)),
              focusedBorder: OutlineInputBorder(borderSide: BorderSide(color: Colors.white38)),
              contentPadding: EdgeInsets.symmetric(horizontal: 14, vertical: 12),
            ),
            items: _methods.entries
                .map((e) => DropdownMenuItem(value: e.key, child: Text(e.value)))
                .toList(),
            onChanged: (v) => setState(() => _method = v!),
          ),
          if (_error != null) ...[
            const SizedBox(height: 10),
            Text(_error!, style: const TextStyle(color: Colors.red, fontSize: 11)),
          ],
          const SizedBox(height: 20),
          Row(
            children: [
              Expanded(
                child: OutlinedButton(
                  style: OutlinedButton.styleFrom(
                    side: const BorderSide(color: Colors.white24),
                    foregroundColor: Colors.white54,
                    padding: const EdgeInsets.symmetric(vertical: 14),
                    shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(2)),
                  ),
                  onPressed: () => Navigator.pop(context),
                  child: const Text('CANCEL', style: TextStyle(fontSize: 10, letterSpacing: 2, fontWeight: FontWeight.w700)),
                ),
              ),
              const SizedBox(width: 12),
              Expanded(
                child: FilledButton(
                  style: FilledButton.styleFrom(
                    backgroundColor: Colors.white,
                    foregroundColor: Colors.black,
                    padding: const EdgeInsets.symmetric(vertical: 14),
                    shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(2)),
                  ),
                  onPressed: _submitting ? null : _submit,
                  child: _submitting
                      ? const SizedBox(width: 16, height: 16, child: CircularProgressIndicator(strokeWidth: 2, color: Colors.black))
                      : const Text('SUBMIT REQUEST', style: TextStyle(fontSize: 10, letterSpacing: 2, fontWeight: FontWeight.w700)),
                ),
              ),
            ],
          ),
        ],
      );

  Widget _buildSuccess() => Column(
        mainAxisSize: MainAxisSize.min,
        children: [
          const Icon(Icons.check_circle_outline, color: Colors.white, size: 36),
          const SizedBox(height: 16),
          const Text('PAYOUT REQUEST SUBMITTED', style: _header),
          const SizedBox(height: 8),
          Text(
            'Processing typically takes 3–5 business days.\n'
            'Remaining balance: ₹${_remainingBalance?.toStringAsFixed(2) ?? '—'}',
            style: _muted,
            textAlign: TextAlign.center,
          ),
          const SizedBox(height: 20),
          TextButton(
            onPressed: () => Navigator.pop(context),
            child: const Text('CLOSE', style: TextStyle(color: Colors.white54, fontSize: 10, letterSpacing: 2)),
          ),
        ],
      );

  @override
  void dispose() {
    _amountCtrl.dispose();
    super.dispose();
  }
}

// =============================================================================
// SHARED LAYOUT HELPERS
// =============================================================================

class _Panel extends StatelessWidget {
  final String title;
  final Widget child;
  final Widget? trailing;

  const _Panel({required this.title, required this.child, this.trailing});

  @override
  Widget build(BuildContext context) => Container(
        decoration: BoxDecoration(
          color: Colors.black,
          border: Border.all(color: Colors.white12),
          borderRadius: BorderRadius.circular(8),
        ),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            // Header bar
            Container(
              padding: const EdgeInsets.symmetric(horizontal: 20, vertical: 14),
              decoration: const BoxDecoration(
                border: Border(bottom: BorderSide(color: Colors.white12)),
              ),
              child: Row(
                children: [
                  Text(title, style: _header),
                  const Spacer(),
                  if (trailing != null) trailing!,
                ],
              ),
            ),
            Padding(padding: const EdgeInsets.all(20), child: child),
          ],
        ),
      );
}

class _Dropdown extends StatelessWidget {
  final String label;
  final String value;
  final List<String> items;
  final void Function(String) onChanged;

  const _Dropdown({
    required this.label,
    required this.value,
    required this.items,
    required this.onChanged,
  });

  @override
  Widget build(BuildContext context) => DropdownButtonFormField<String>(
        value: value,
        dropdownColor: const Color(0xFF111111),
        style: const TextStyle(color: Colors.white, fontSize: 13),
        decoration: InputDecoration(
          labelText: label,
          labelStyle: const TextStyle(color: Colors.white38, fontSize: 10, letterSpacing: 1.5),
          enabledBorder: const OutlineInputBorder(borderSide: BorderSide(color: Colors.white12)),
          focusedBorder: const OutlineInputBorder(borderSide: BorderSide(color: Colors.white38)),
          contentPadding: const EdgeInsets.symmetric(horizontal: 14, vertical: 12),
        ),
        items: items.map((v) => DropdownMenuItem(value: v, child: Text(v))).toList(),
        onChanged: (v) { if (v != null) onChanged(v); },
      );
}

class _WideButton extends StatelessWidget {
  final String label;
  final String? loadingLabel;
  final bool loading;
  final bool disabled;
  final VoidCallback? onPressed;

  const _WideButton({
    required this.label,
    this.loadingLabel,
    this.loading = false,
    this.disabled = false,
    this.onPressed,
  });

  @override
  Widget build(BuildContext context) => SizedBox(
        width: double.infinity,
        child: OutlinedButton(
          style: OutlinedButton.styleFrom(
            side: BorderSide(color: disabled ? Colors.white12 : Colors.white38),
            foregroundColor: disabled ? Colors.white24 : Colors.white,
            padding: const EdgeInsets.symmetric(vertical: 14),
            shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(2)),
          ),
          onPressed: (loading || disabled) ? null : onPressed,
          child: loading
              ? Row(mainAxisAlignment: MainAxisAlignment.center, children: [
                  const SizedBox(
                    width: 14, height: 14,
                    child: CircularProgressIndicator(strokeWidth: 2, color: Colors.white38),
                  ),
                  if (loadingLabel != null) ...[
                    const SizedBox(width: 10),
                    Text(loadingLabel!, style: const TextStyle(fontSize: 10, letterSpacing: 1.5)),
                  ],
                ])
              : Text(label, style: const TextStyle(fontSize: 10, fontWeight: FontWeight.w700, letterSpacing: 1.5)),
        ),
      );
}

class _BalanceTile extends StatelessWidget {
  final String label;
  final String value;
  final bool primary;
  const _BalanceTile({required this.label, required this.value, this.primary = false});

  @override
  Widget build(BuildContext context) => Expanded(
        child: Container(
          padding: const EdgeInsets.all(12),
          decoration: BoxDecoration(
            border: Border.all(color: primary ? Colors.white38 : Colors.white12),
            borderRadius: BorderRadius.circular(4),
          ),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Text(label, style: const TextStyle(color: Colors.white38, fontSize: 9, letterSpacing: 1.5, fontWeight: FontWeight.w700)),
              const SizedBox(height: 4),
              Text(value, style: TextStyle(
                color: primary ? Colors.white : Colors.white70,
                fontSize: primary ? 14 : 12,
                fontWeight: primary ? FontWeight.w700 : FontWeight.normal,
              )),
            ],
          ),
        ),
      );
}
