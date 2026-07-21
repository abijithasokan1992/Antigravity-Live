import 'dart:math';
import 'package:flutter/material.dart';
import '../components/fast_player_widget.dart';
// Note: In production we'd use fl_chart for graphing. We will build a styled mock graph here.

class FastAnalyticsView extends StatefulWidget {
  const FastAnalyticsView({super.key});

  @override
  State<FastAnalyticsView> createState() => _FastAnalyticsViewState();
}

class _FastAnalyticsViewState extends State<FastAnalyticsView> {
  // Mocked Metrics from backend /api/v1/fast/analytics/realtime
  final int _concurrentViewers = 14205;
  final double _adFillRate = 94.2;
  final double _estimatedRevenue = 1245.50;
  
  @override
  Widget build(BuildContext context) {
    return Container(
      color: const Color(0xFF0F0F0F),
      padding: const EdgeInsets.all(48.0),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          const Text(
            'FAST CHANNEL ANALYTICS',
            style: TextStyle(
              color: Colors.white,
              fontSize: 24,
              fontWeight: FontWeight.bold,
              letterSpacing: 2,
            ),
          ),
          const SizedBox(height: 16),
          const Text(
            'Real-time streaming telemetry and Server-Side Ad Insertion (SSAI) metrics.',
            style: TextStyle(color: Colors.white54, fontSize: 16),
          ),
          const SizedBox(height: 48),
          
          Expanded(
            child: Row(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                // Left Column: Player & Real-time Stats
                Expanded(
                  flex: 1,
                  child: Column(
                    children: [
                      // The Fast Player
                      const SizedBox(
                        height: 300,
                        child: FastPlayerWidget(),
                      ),
                      const SizedBox(height: 24),
                      // Real-time KPI Cards
                      Row(
                        children: [
                          Expanded(child: _buildKpiCard('CONCURRENT VIEWERS', '$_concurrentViewers', Icons.people, Colors.blueAccent)),
                          const SizedBox(width: 16),
                          Expanded(child: _buildKpiCard('AD FILL RATE', '$_adFillRate%', Icons.monetization_on, Colors.greenAccent)),
                        ],
                      ),
                      const SizedBox(height: 16),
                      _buildKpiCard('EST. REVENUE (24H)', '\$$_estimatedRevenue', Icons.account_balance_wallet, Colors.amberAccent),
                    ],
                  ),
                ),
                const SizedBox(width: 48),
                // Right Column: Historical Graph
                Expanded(
                  flex: 1,
                  child: Container(
                    padding: const EdgeInsets.all(32),
                    decoration: BoxDecoration(
                      color: const Color(0xFF161616),
                      border: Border.all(color: Colors.white12),
                      borderRadius: BorderRadius.circular(8),
                    ),
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        const Text('AUDIENCE RETENTION & MONETIZATION', style: TextStyle(color: Colors.white, fontWeight: FontWeight.bold, letterSpacing: 1)),
                        const SizedBox(height: 32),
                        // Mock Chart Visualization
                        Expanded(child: _buildMockChart()),
                      ],
                    ),
                  ),
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildKpiCard(String title, String value, IconData icon, Color highlightColor) {
    return Container(
      padding: const EdgeInsets.all(24),
      decoration: BoxDecoration(
        color: const Color(0xFF161616),
        border: Border.all(color: Colors.white12),
        borderRadius: BorderRadius.circular(8),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            children: [
              Icon(icon, color: highlightColor, size: 20),
              const SizedBox(width: 8),
              Text(title, style: const TextStyle(color: Colors.white54, fontSize: 12, fontWeight: FontWeight.bold, letterSpacing: 1)),
            ],
          ),
          const SizedBox(height: 16),
          Text(value, style: const TextStyle(color: Colors.white, fontSize: 32, fontWeight: FontWeight.w900)),
        ],
      ),
    );
  }

  Widget _buildMockChart() {
    // A stylized mock representation of a line chart using containers
    return Column(
      children: [
        Expanded(
          child: Row(
            crossAxisAlignment: CrossAxisAlignment.end,
            mainAxisAlignment: MainAxisAlignment.spaceEvenly,
            children: List.generate(24, (index) {
              // Sine wave math to simulate daily peak viewing hours
              final heightPercent = (sin((index / 24) * pi * 2 - pi/2) + 1) / 2; // 0.0 to 1.0
              final isPeak = heightPercent > 0.8;
              
              return Container(
                width: 12,
                height: 50 + (250 * heightPercent), // Scaled height
                decoration: BoxDecoration(
                  gradient: LinearGradient(
                    begin: Alignment.bottomCenter,
                    end: Alignment.topCenter,
                    colors: [
                      isPeak ? Colors.greenAccent.withOpacity(0.8) : Colors.blueAccent.withOpacity(0.5),
                      isPeak ? Colors.greenAccent.withOpacity(0.1) : Colors.blueAccent.withOpacity(0.1),
                    ],
                  ),
                  borderRadius: const BorderRadius.vertical(top: Radius.circular(4)),
                ),
              );
            }),
          ),
        ),
        const SizedBox(height: 16),
        const Row(
          mainAxisAlignment: MainAxisAlignment.spaceBetween,
          children: [
            Text('00:00', style: TextStyle(color: Colors.white54, fontSize: 12)),
            Text('12:00', style: TextStyle(color: Colors.white54, fontSize: 12)),
            Text('24:00', style: TextStyle(color: Colors.white54, fontSize: 12)),
          ],
        )
      ],
    );
  }
}
