import 'package:flutter/material.dart';

class LicensingCrmView extends StatefulWidget {
  const LicensingCrmView({super.key});

  @override
  State<LicensingCrmView> createState() => _LicensingCrmViewState();
}

class _LicensingCrmViewState extends State<LicensingCrmView> {
  final List<String> _territories = [
    'GLOBAL',
    'NORTH AMERICA',
    'EUROPE',
    'ASIA (Excl. India)',
    'INDIA (National)',
    'KERALA',
    'TAMIL NADU',
  ];

  final List<String> _rights = [
    'THEATRICAL',
    'SVOD',
    'AVOD',
    'PAY TV',
    'FREE TV',
  ];

  // Mocked state: false = Available (Green), true = Sold/Holdback (Red)
  final Map<String, bool> _salesMatrix = {
    'KERALA_THEATRICAL': true,
    'KERALA_PAY TV': true,
    'INDIA (National)_SVOD': true,
    'GLOBAL_AVOD': false,
  };

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
                    'LICENSING CRM / RIGHTS AVAILS',
                    style: TextStyle(
                      color: Colors.white,
                      fontSize: 24,
                      fontWeight: FontWeight.bold,
                      letterSpacing: 2,
                    ),
                  ),
                  SizedBox(height: 16),
                  Text(
                    'Track exclusive licenses and active holdback periods.',
                    style: TextStyle(color: Colors.white54, fontSize: 16),
                  ),
                ],
              ),
              // Film Selector
              Container(
                padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
                decoration: BoxDecoration(
                  color: Colors.white12,
                  borderRadius: BorderRadius.circular(8),
                ),
                child: const Row(
                  children: [
                    Icon(Icons.movie, color: Colors.white),
                    SizedBox(width: 12),
                    Text('Jananam 1947', style: TextStyle(color: Colors.white, fontWeight: FontWeight.bold)),
                    SizedBox(width: 12),
                    Icon(Icons.arrow_drop_down, color: Colors.white),
                  ],
                ),
              )
            ],
          ),
          const SizedBox(height: 48),
          Expanded(
            child: _buildMatrix(),
          ),
        ],
      ),
    );
  }

  Widget _buildMatrix() {
    return Container(
      decoration: BoxDecoration(
        color: const Color(0xFF161616),
        border: Border.all(color: Colors.white12),
        borderRadius: BorderRadius.circular(8),
      ),
      child: Column(
        children: [
          // Header Row (Rights)
          Container(
            decoration: const BoxDecoration(
              border: Border(bottom: BorderSide(color: Colors.white12)),
            ),
            child: Row(
              children: [
                // Empty top-left cell
                const SizedBox(width: 200, height: 60),
                ..._rights.map((right) => Expanded(
                  child: Container(
                    height: 60,
                    alignment: Alignment.center,
                    decoration: const BoxDecoration(
                      border: Border(left: BorderSide(color: Colors.white12)),
                    ),
                    child: Text(
                      right,
                      style: const TextStyle(color: Colors.white, fontWeight: FontWeight.bold),
                    ),
                  ),
                )),
              ],
            ),
          ),
          // Body Rows (Territories)
          Expanded(
            child: ListView.builder(
              itemCount: _territories.length,
              itemBuilder: (context, index) {
                final territory = _territories[index];
                return Container(
                  decoration: const BoxDecoration(
                    border: Border(bottom: BorderSide(color: Colors.white12)),
                  ),
                  child: Row(
                    children: [
                      // Territory Label
                      Container(
                        width: 200,
                        height: 80,
                        alignment: Alignment.centerLeft,
                        padding: const EdgeInsets.only(left: 24),
                        child: Text(
                          territory,
                          style: const TextStyle(color: Colors.white70, fontWeight: FontWeight.bold),
                        ),
                      ),
                      // Matrix Cells
                      ..._rights.map((right) {
                        final key = '${territory}_$right';
                        final isSold = _salesMatrix[key] ?? false;
                        
                        return Expanded(
                          child: InkWell(
                            onTap: () {
                              // ScaffoldMessenger.of(context).showSnackBar(SnackBar(content: Text('Manage $key')));
                            },
                            child: Container(
                              height: 80,
                              decoration: BoxDecoration(
                                color: isSold ? Colors.redAccent.withOpacity(0.1) : Colors.greenAccent.withOpacity(0.05),
                                border: const Border(left: BorderSide(color: Colors.white12)),
                              ),
                              child: Center(
                                child: isSold
                                  ? const Column(
                                      mainAxisAlignment: MainAxisAlignment.center,
                                      children: [
                                        Icon(Icons.lock, color: Colors.redAccent, size: 20),
                                        SizedBox(height: 4),
                                        Text('SOLD', style: TextStyle(color: Colors.redAccent, fontSize: 10, fontWeight: FontWeight.bold)),
                                      ],
                                    )
                                  : const Column(
                                      mainAxisAlignment: MainAxisAlignment.center,
                                      children: [
                                        Icon(Icons.check_circle_outline, color: Colors.greenAccent, size: 20),
                                        SizedBox(height: 4),
                                        Text('AVAILABLE', style: TextStyle(color: Colors.greenAccent, fontSize: 10, fontWeight: FontWeight.bold)),
                                      ],
                                    ),
                              ),
                            ),
                          ),
                        );
                      }),
                    ],
                  ),
                );
              },
            ),
          ),
        ],
      ),
    );
  }
}
