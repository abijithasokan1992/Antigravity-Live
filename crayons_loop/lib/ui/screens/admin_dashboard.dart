import 'package:flutter/material.dart';
import 'mail_center_view.dart';
import 'buyer_crm_view.dart';
import 'licensing_crm_view.dart';
import 'distribution_crm_view.dart';
import 'fast_analytics_view.dart';
import 'automation_view.dart';
import 'blockchain_registry_view.dart';

class AdminDashboardScreen extends StatefulWidget {
  const AdminDashboardScreen({super.key});

  @override
  State<AdminDashboardScreen> createState() => _AdminDashboardScreenState();
}

class _AdminDashboardScreenState extends State<AdminDashboardScreen> {
  int _selectedIndex = 3; // Default to Mail Center

  final List<String> _menuItems = [
    'Dashboard',
    'Users',
    'Organizations',
    'Mail Center',
    'Buyer CRM',
    'Licensing CRM',
    'Distribution Hub',
    'FAST Analytics',
    'Automation Engine',
    'Secure Rights Ledger',
    'Settings',
  ];

  Widget _buildBody() {
    switch (_selectedIndex) {
      case 3:
        return const MailCenterView();
      case 4:
        return const BuyerCrmView();
      case 5:
        return const LicensingCrmView();
      case 6:
        return const DistributionCrmView();
      case 7:
        return const FastAnalyticsView();
      case 8:
        return const AutomationView();
      case 9:
        return const BlockchainRegistryView();
      default:
        return Center(
          child: Text(
            '${_menuItems[_selectedIndex]} Module',
            style: const TextStyle(color: Colors.white54, fontSize: 24, letterSpacing: 2),
          ),
        );
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: const Color(0xFF0F0F0F),
      body: Row(
        children: [
          // Sidebar
          Container(
            width: 260,
            decoration: const BoxDecoration(
              color: Color(0xFF161616),
              border: Border(right: BorderSide(color: Colors.white12)),
            ),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                const Padding(
                  padding: EdgeInsets.all(32.0),
                  child: Text(
                    'STREAMVISTA\nOS ADMIN',
                    style: TextStyle(
                      color: Colors.white,
                      fontSize: 18,
                      fontWeight: FontWeight.w900,
                      letterSpacing: 2,
                      height: 1.2,
                    ),
                  ),
                ),
                const SizedBox(height: 16),
                Expanded(
                  child: ListView.builder(
                    itemCount: _menuItems.length,
                    itemBuilder: (context, index) {
                      final isSelected = _selectedIndex == index;
                      final isCRM = _menuItems[index].contains('CRM');
                      final isMail = _menuItems[index].contains('Mail');
                      
                      return ListTile(
                        selected: isSelected,
                        selectedTileColor: Colors.white10,
                        contentPadding: const EdgeInsets.symmetric(horizontal: 32, vertical: 4),
                        leading: Icon(
                          isMail ? Icons.mail : (isCRM ? Icons.handshake : Icons.grid_view),
                          color: isSelected ? Colors.redAccent : Colors.white54,
                          size: 20,
                        ),
                        title: Text(
                          _menuItems[index],
                          style: TextStyle(
                            color: isSelected ? Colors.white : Colors.white70,
                            fontWeight: isSelected ? FontWeight.bold : FontWeight.normal,
                          ),
                        ),
                        onTap: () {
                          setState(() {
                            _selectedIndex = index;
                          });
                        },
                      );
                    },
                  ),
                ),
              ],
            ),
          ),
          
          // Main Content
          Expanded(
            child: _buildBody(),
          ),
        ],
      ),
    );
  }
}
