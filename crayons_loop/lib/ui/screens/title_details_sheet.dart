import 'package:flutter/material.dart';
import '../../models/catalog_title.dart';
import 'player_screen.dart';

class TitleDetailsSheet extends StatelessWidget {
  final CatalogTitle title;

  const TitleDetailsSheet({super.key, required this.title});

  static void show(BuildContext context, CatalogTitle title) {
    showModalBottomSheet(
      context: context,
      backgroundColor: Colors.transparent,
      isScrollControlled: true,
      builder: (context) => TitleDetailsSheet(title: title),
    );
  }

  @override
  Widget build(BuildContext context) {
    return Container(
      decoration: BoxDecoration(
        color: Colors.grey[900],
        borderRadius: const BorderRadius.vertical(top: Radius.circular(24)),
      ),
      padding: const EdgeInsets.all(24),
      child: Column(
        mainAxisSize: MainAxisSize.min,
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              Expanded(
                child: Text(
                  title.title,
                  style: const TextStyle(color: Colors.white, fontSize: 24, fontWeight: FontWeight.bold),
                ),
              ),
              IconButton(
                icon: const Icon(Icons.close, color: Colors.white54),
                onPressed: () => Navigator.pop(context),
              )
            ],
          ),
          const SizedBox(height: 16),
          Row(
            children: [
              if (title.releaseDate != null) ...[
                Text(title.releaseDate!.substring(0, 4), style: const TextStyle(color: Colors.white70)),
                const SizedBox(width: 16),
              ],
              if (title.duration != null) ...[
                Text('${(title.duration! / 60).floor()}m', style: const TextStyle(color: Colors.white70)),
                const SizedBox(width: 16),
              ],
              if (title.language != null) ...[
                Container(
                  padding: const EdgeInsets.symmetric(horizontal: 6, vertical: 2),
                  decoration: BoxDecoration(
                    border: Border.all(color: Colors.white30),
                    borderRadius: BorderRadius.circular(4)
                  ),
                  child: Text(title.language!.toUpperCase(), style: const TextStyle(color: Colors.white70, fontSize: 12)),
                )
              ]
            ],
          ),
          const SizedBox(height: 24),
          SizedBox(
            width: double.infinity,
            child: ElevatedButton.icon(
              style: ElevatedButton.styleFrom(
                backgroundColor: const Color(0xFFFF1E27), // Crimson Red
                padding: const EdgeInsets.symmetric(vertical: 16),
                shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(8)),
              ),
              onPressed: () {
                Navigator.pop(context); // Close sheet
                if (title.streamUrl != null) {
                  Navigator.push(
                    context,
                    MaterialPageRoute(
                      builder: (_) => PlayerScreen(streamUrl: title.streamUrl!, title: title.title),
                    ),
                  );
                } else {
                  ScaffoldMessenger.of(context).showSnackBar(
                    const SnackBar(content: Text('Stream URL not available', style: TextStyle(color: Colors.white)), backgroundColor: Colors.red),
                  );
                }
              },
              icon: const Icon(Icons.play_arrow, color: Colors.white),
              label: const Text('Play', style: TextStyle(color: Colors.white, fontSize: 18, fontWeight: FontWeight.bold)),
            ),
          ),
          const SizedBox(height: 32),
        ],
      ),
    );
  }
}
