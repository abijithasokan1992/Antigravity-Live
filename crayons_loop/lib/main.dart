import 'package:flutter/material.dart';
import 'package:fl_chart/fl_chart.dart';
import 'ui/components/chunked_upload_engine.dart';
import 'ui/components/qc_checklist_panel.dart';
import 'ui/components/financials_and_delivery_widgets.dart';
import 'ui/components/message_threads_panel.dart';
import 'ui/components/rights_avails_sheet.dart';
import 'ui/components/pipeline_board.dart';
import 'ui/components/fast_player_widget.dart';

void main() {
  runApp(const StreamVistaAnalyticsApp());
}

class StreamVistaAnalyticsApp extends StatelessWidget {
  const StreamVistaAnalyticsApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'StreamVista Workbench - Analytics',
      theme: ThemeData(
        brightness: Brightness.dark,
        scaffoldBackgroundColor: const Color(0xFF000000), // Pure Pitch Black
        primaryColor: Colors.white,
        cardColor: const Color(0xFF000000),
        dividerColor: Colors.white24,
        fontFamily: 'Roboto', // Default clean font
      ),
      home: const AnalyticsDashboard(),
    );
  }
}

class AnalyticsDashboard extends StatelessWidget {
  const AnalyticsDashboard({super.key});

  @override
  Widget build(BuildContext context) {
    // TODO: wire to session before deploy
    const String dummyAuthToken = 'dummy_token_do_not_commit';
    const String dummyTitleId = '123e4567-e89b-12d3-a456-426614174000';
    const String dummyCreatorPartyId = 'creator-party-id';

    return Scaffold(
      body: Row(
        children: [
          // Left Sidebar
          Container(
            width: 250,
            decoration: const BoxDecoration(
              color: Color(0xFF000000),
              border: Border(right: BorderSide(color: Colors.white, width: 1)),
            ),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                const Padding(
                  padding: EdgeInsets.all(24.0),
                  child: Text(
                    'STREAMVISTA',
                    style: TextStyle(
                        color: Colors.white,
                        fontSize: 24,
                        letterSpacing: 2,
                        fontWeight: FontWeight.w900),
                  ),
                ),
                const Divider(color: Colors.white, height: 1),
                _buildSidebarItem(Icons.dashboard_outlined, 'Dashboard',
                    isActive: true),
                _buildSidebarItem(Icons.movie_outlined, 'Titles'),
                _buildSidebarItem(Icons.analytics_outlined, 'Performance'),
                _buildSidebarItem(
                    Icons.account_balance_wallet_outlined, 'Financials'),
                _buildSidebarItem(Icons.gavel_outlined, 'Rights Engine'),
                const Spacer(),
                const Divider(color: Colors.white, height: 1),
                _buildSidebarItem(Icons.settings_outlined, 'Settings'),
                const SizedBox(height: 16),
              ],
            ),
          ),

          // Main Content Area
          Expanded(
            child: Column(
              children: [
                // Strict Legal Directive Header
                Container(
                  width: double.infinity,
                  padding: const EdgeInsets.symmetric(vertical: 12),
                  decoration: const BoxDecoration(
                    color: Colors.white,
                  ),
                  child: const Center(
                    child: Text(
                      'ALL SUB-LICENSES ARE NON-SUBLICENSABLE • NO RIGHT TO DELIVER TO NEXT PERSON',
                      style: TextStyle(
                        color: Colors.black,
                        fontWeight: FontWeight.w900,
                        letterSpacing: 1.5,
                        fontSize: 14,
                      ),
                    ),
                  ),
                ),

                // Grid Content
                Expanded(
                  child: SingleChildScrollView(
                    child: Padding(
                      padding: const EdgeInsets.all(32.0),
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          const Text(
                            'Performance Overview',
                            style: TextStyle(
                                color: Colors.white,
                                fontSize: 28,
                                fontWeight: FontWeight.bold),
                          ),
                          const SizedBox(height: 32),

                          // Top Row: Chart & Top Titles
                          Row(
                            crossAxisAlignment: CrossAxisAlignment.start,
                            children: [
                              // Chart Panel
                              Expanded(
                                flex: 2,
                                child: Container(
                                  padding: const EdgeInsets.all(24),
                                  decoration: BoxDecoration(
                                    border: Border.all(
                                        color: Colors.white, width: 1),
                                  ),
                                  child: Column(
                                    crossAxisAlignment:
                                        CrossAxisAlignment.start,
                                    children: [
                                      const Text(
                                        '6-Month Revenue by MediaType',
                                        style: TextStyle(
                                            color: Colors.white,
                                            fontSize: 18,
                                            fontWeight: FontWeight.bold),
                                      ),
                                      const SizedBox(height: 32),
                                      Expanded(child: _buildStackedBarChart()),
                                    ],
                                  ),
                                ),
                              ),
                              const SizedBox(width: 32),

                              // Top Titles Panel
                              Expanded(
                                flex: 1,
                                child: Container(
                                  width: double.infinity,
                                  padding: const EdgeInsets.all(24),
                                  decoration: BoxDecoration(
                                    border: Border.all(
                                        color: Colors.white, width: 1),
                                  ),
                                  child: Column(
                                    crossAxisAlignment:
                                        CrossAxisAlignment.start,
                                    children: [
                                      const Text(
                                        'Top Titles',
                                        style: TextStyle(
                                            color: Colors.white,
                                            fontSize: 18,
                                            fontWeight: FontWeight.bold),
                                      ),
                                      const SizedBox(height: 16),
                                      Expanded(
                                        child: ListView(
                                          children: [
                                            _buildListItem(
                                                'Jananam 1947', '214K Views'),
                                            _buildListItem('The Great Kerala',
                                                '189K Views'),
                                            _buildListItem(
                                                'Untitled Draft', '12K Views'),
                                          ],
                                        ),
                                      )
                                    ],
                                  ),
                                ),
                              ),
                            ],
                          ),
                          const SizedBox(height: 32),
                          const Text(
                            'FAST Channel Monitor',
                            style: TextStyle(
                                color: Colors.white,
                                fontSize: 24,
                                fontWeight: FontWeight.bold),
                          ),
                          const SizedBox(height: 16),
                          const SizedBox(
                            height: 600, // Fixed height for monitor
                            child: FastPlayerWidget(),
                          ),
                          const SizedBox(height: 32),
                          const PipelineBoard(),
                          const SizedBox(height: 32),
                          // New UI Components
                          Row(
                            crossAxisAlignment: CrossAxisAlignment.start,
                            children: [
                              Expanded(
                                flex: 3,
                                child: Column(
                                  children: [
                                    const RightsAvailsSheet(
                                        titleId: dummyTitleId),
                                    const SizedBox(height: 16),
                                    const MessageThreadsPanel(
                                        titleId: dummyTitleId),
                                  ],
                                ),
                              ),
                              const SizedBox(width: 32),
                              Expanded(
                                flex: 2,
                                child: Column(
                                  children: [
                                    QCChecklistPanel(
                                        titleId: dummyTitleId, onSubmit: () {}),
                                    const SizedBox(height: 16),
                                    ChunkedUploadWidget(titleId: dummyTitleId),
                                  ],
                                ),
                              ),
                            ],
                          ),
                          const SizedBox(height: 32),
                          const Divider(color: Colors.white24, height: 1),
                          const SizedBox(height: 32),
                          const Text('PHASE 2: FINANCIALS & DELIVERY',
                              style: TextStyle(
                                  color: Colors.white,
                                  fontSize: 16,
                                  fontWeight: FontWeight.bold)),
                          const SizedBox(height: 16),
                          Row(
                            crossAxisAlignment: CrossAxisAlignment.start,
                            children: [
                              Expanded(
                                child: DeliveryExporterPanel(
                                    titleId: dummyTitleId,
                                    titleName: 'Jananam 1947'),
                              ),
                              const SizedBox(width: 32),
                              Expanded(
                                child: SizedBox(
                                  height: 600,
                                  child: FinancialLedgerPanel(
                                    titleId: dummyTitleId,
                                    creatorPartyId: dummyCreatorPartyId,
                                  ),
                                ),
                              ),
                            ],
                          ),
                        ],
                      ),
                    ),
                  ),
                )
              ],
            ),
          )
        ],
      ),
    );
  }

  Widget _buildSidebarItem(IconData icon, String title,
      {bool isActive = false}) {
    return Container(
      color: isActive ? Colors.white : Colors.transparent,
      child: ListTile(
        leading: Icon(icon, color: isActive ? Colors.black : Colors.white),
        title: Text(
          title,
          style: TextStyle(
            color: isActive ? Colors.black : Colors.white,
            fontWeight: isActive ? FontWeight.bold : FontWeight.normal,
          ),
        ),
        onTap: () {},
      ),
    );
  }

  Widget _buildListItem(String title, String trailing) {
    return Padding(
      padding: const EdgeInsets.symmetric(vertical: 8.0),
      child: Row(
        mainAxisAlignment: MainAxisAlignment.spaceBetween,
        children: [
          Text(title,
              style: const TextStyle(color: Colors.white, fontSize: 14)),
          Text(trailing,
              style: const TextStyle(
                  color: Colors.white,
                  fontSize: 14,
                  fontWeight: FontWeight.bold)),
        ],
      ),
    );
  }

  Widget _buildStackedBarChart() {
    return BarChart(
      BarChartData(
        alignment: BarChartAlignment.spaceAround,
        maxY: 100,
        barTouchData: BarTouchData(enabled: false),
        titlesData: FlTitlesData(
          show: true,
          bottomTitles: AxisTitles(
            sideTitles: SideTitles(
              showTitles: true,
              getTitlesWidget: (value, meta) {
                const style = TextStyle(
                    color: Colors.white,
                    fontWeight: FontWeight.bold,
                    fontSize: 12);
                String text;
                switch (value.toInt()) {
                  case 0:
                    text = 'Jan';
                    break;
                  case 1:
                    text = 'Feb';
                    break;
                  case 2:
                    text = 'Mar';
                    break;
                  case 3:
                    text = 'Apr';
                    break;
                  case 4:
                    text = 'May';
                    break;
                  case 5:
                    text = 'Jun';
                    break;
                  default:
                    text = '';
                    break;
                }
                return SideTitleWidget(
                  meta: meta,
                  space: 4.0,
                  child: Text(text, style: style),
                );
              },
            ),
          ),
          leftTitles: AxisTitles(sideTitles: SideTitles(showTitles: false)),
          rightTitles: AxisTitles(sideTitles: SideTitles(showTitles: false)),
          topTitles: AxisTitles(sideTitles: SideTitles(showTitles: false)),
        ),
        gridData: FlGridData(
          show: true,
          drawVerticalLine: false,
          horizontalInterval: 20,
          getDrawingHorizontalLine: (value) =>
              const FlLine(color: Colors.white24, strokeWidth: 1),
        ),
        borderData: FlBorderData(show: false),
        barGroups: [
          _generateGroupData(0, 40, 20, 10),
          _generateGroupData(1, 30, 25, 15),
          _generateGroupData(2, 50, 30, 10),
          _generateGroupData(3, 45, 35, 20),
          _generateGroupData(4, 60, 20, 15),
          _generateGroupData(5, 55, 25, 10),
        ],
      ),
    );
  }

  BarChartGroupData _generateGroupData(
      int x, double val1, double val2, double val3) {
    return BarChartGroupData(
      x: x,
      groupVertically: true,
      barRods: [
        BarChartRodData(
            fromY: 0,
            toY: val1,
            color: Colors.white,
            width: 30,
            borderRadius: BorderRadius.zero),
        BarChartRodData(
            fromY: val1,
            toY: val1 + val2,
            color: Colors.grey[700]!,
            width: 30,
            borderRadius: BorderRadius.zero),
        BarChartRodData(
            fromY: val1 + val2,
            toY: val1 + val2 + val3,
            color: Colors.grey[400]!,
            width: 30,
            borderRadius: BorderRadius.zero),
      ],
    );
  }
}

// --- Active Channels Data Table Component ---

class ChannelData {
  final String platform;
  final String territory;
  final String status;
  final String streams;

  ChannelData(this.platform, this.territory, this.status, this.streams);
}

class ActiveChannelsDataTable extends StatelessWidget {
  const ActiveChannelsDataTable({super.key});

  @override
  Widget build(BuildContext context) {
    final List<ChannelData> channels = [
      ChannelData('Sun NXT', 'IND (Exclusive)', 'Live', '45,200'),
      ChannelData(
          'Amazon Prime Video', 'WLD (Non-Exclusive)', 'Delivered', '--'),
      ChannelData('JioCinema', 'IND (Non-Exclusive)', 'Live', '112,045'),
      ChannelData('ZEE5', 'IND (Exclusive)', 'Pending QC', '--'),
      ChannelData('Saina Play', 'WLD (Non-Exclusive)', 'Live', '18,400'),
      ChannelData('BookMyShow Stream', 'IND (TVOD)', 'Live', '4,200'),
    ];

    return Column(
      crossAxisAlignment: CrossAxisAlignment.stretch,
      children: [
        const Padding(
          padding: EdgeInsets.all(24.0),
          child: Text(
            'Active Distribution Channels',
            style: TextStyle(
                color: Colors.white, fontSize: 18, fontWeight: FontWeight.bold),
          ),
        ),
        const Divider(color: Colors.white24, height: 1),
        Expanded(
          child: SingleChildScrollView(
            child: DataTable(
              headingTextStyle: const TextStyle(
                  color: Colors.white,
                  fontWeight: FontWeight.bold,
                  fontSize: 14),
              dataTextStyle:
                  const TextStyle(color: Colors.white70, fontSize: 14),
              dividerThickness: 1,
              columns: const [
                DataColumn(label: Text('Platform')),
                DataColumn(label: Text('Territory & Rights')),
                DataColumn(label: Text('Status')),
                DataColumn(label: Text('Monthly Streams (Est)')),
              ],
              rows: channels.map((channel) {
                return DataRow(
                  cells: [
                    DataCell(Text(channel.platform,
                        style: const TextStyle(
                            fontWeight: FontWeight.bold, color: Colors.white))),
                    DataCell(Text(channel.territory)),
                    DataCell(_buildStatusBadge(channel.status)),
                    DataCell(Text(channel.streams)),
                  ],
                );
              }).toList(),
            ),
          ),
        ),
      ],
    );
  }

  Widget _buildStatusBadge(String status) {
    Color borderColor;
    Color textColor;

    switch (status) {
      case 'Live':
        borderColor = Colors.white;
        textColor = Colors.white;
        break;
      case 'Delivered':
        borderColor = Colors.grey[500]!;
        textColor = Colors.grey[300]!;
        break;
      case 'Pending QC':
        borderColor = Colors.grey[700]!;
        textColor = Colors.grey[500]!;
        break;
      default:
        borderColor = Colors.white24;
        textColor = Colors.white70;
    }

    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 6),
      decoration: BoxDecoration(
        color: Colors.transparent,
        border: Border.all(color: borderColor, width: 1),
        borderRadius: BorderRadius.zero, // Keep it sharp and strict
      ),
      child: Text(
        status.toUpperCase(),
        style: TextStyle(
            color: textColor,
            fontSize: 12,
            fontWeight: FontWeight.bold,
            letterSpacing: 1),
      ),
    );
  }
}
