import 'package:flutter/material.dart';

class ScreeningRoomScreen extends StatefulWidget {
  final String assetId;
  final String userEmail;

  const ScreeningRoomScreen({
    super.key,
    required this.assetId,
    required this.userEmail,
  });

  @override
  State<ScreeningRoomScreen> createState() => _ScreeningRoomScreenState();
}

class _ScreeningRoomScreenState extends State<ScreeningRoomScreen> {
  final List<Map<String, String>> _comments = [
    {'time': '00:04:12', 'text': 'Color seems a bit too warm here.'},
    {'time': '01:14:22', 'text': 'Can we tighten the edit on this transition?'},
  ];

  final TextEditingController _commentCtrl = TextEditingController();

  void _addComment() {
    if (_commentCtrl.text.isNotEmpty) {
      setState(() {
        _comments.add({
          'time': '01:23:45', // Mock current player time
          'text': _commentCtrl.text
        });
        _commentCtrl.clear();
      });
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: const Color(0xFF000000), // Strict cinematic black
      body: Row(
        children: [
          // Left Area: Cinematic Player with Watermark
          Expanded(
            flex: 3,
            child: Stack(
              children: [
                // Mock Video Player Canvas
                Container(
                  color: Colors.black,
                  child: const Center(
                    child: Icon(Icons.play_circle_outline, color: Colors.white54, size: 100),
                  ),
                ),
                // Dynamic Canvas-based Watermark (Anti-piracy overlay)
                IgnorePointer(
                  child: Center(
                    child: Transform.rotate(
                      angle: -0.5,
                      child: Text(
                        '${widget.userEmail}\nDO NOT DISTRIBUTE',
                        textAlign: TextAlign.center,
                        style: TextStyle(
                          color: Colors.white.withOpacity(0.15),
                          fontSize: 48,
                          fontWeight: FontWeight.w900,
                          letterSpacing: 4,
                        ),
                      ),
                    ),
                  ),
                ),
                // Mock Player Controls overlay
                Positioned(
                  bottom: 0, left: 0, right: 0,
                  child: Container(
                    padding: const EdgeInsets.all(24),
                    decoration: const BoxDecoration(
                      gradient: LinearGradient(
                        begin: Alignment.bottomCenter,
                        end: Alignment.topCenter,
                        colors: [Colors.black87, Colors.transparent],
                      )
                    ),
                    child: Row(
                      children: [
                        const Icon(Icons.pause, color: Colors.white),
                        const SizedBox(width: 16),
                        const Text('01:23:45 / 02:14:00', style: TextStyle(color: Colors.white)),
                        const SizedBox(width: 16),
                        Expanded(
                          child: Slider(
                            value: 0.6,
                            onChanged: (val) {},
                            activeColor: Colors.redAccent,
                            inactiveColor: Colors.white24,
                          ),
                        ),
                        const Icon(Icons.fullscreen, color: Colors.white),
                      ],
                    ),
                  ),
                )
              ],
            ),
          ),
          
          // Right Area: Comments & Approvals
          Container(
            width: 350,
            decoration: const BoxDecoration(
              color: Color(0xFF111111),
              border: Border(left: BorderSide(color: Colors.white24)),
            ),
            child: Column(
              children: [
                const Padding(
                  padding: EdgeInsets.all(24.0),
                  child: Text(
                    'TIMECODE NOTES',
                    style: TextStyle(color: Colors.white, fontSize: 16, fontWeight: FontWeight.bold, letterSpacing: 1.5),
                  ),
                ),
                const Divider(color: Colors.white24, height: 1),
                Expanded(
                  child: ListView.builder(
                    itemCount: _comments.length,
                    itemBuilder: (context, idx) {
                      final c = _comments[idx];
                      return Container(
                        padding: const EdgeInsets.all(16),
                        decoration: const BoxDecoration(border: Border(bottom: BorderSide(color: Colors.white12))),
                        child: Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            Text(
                              c['time']!,
                              style: const TextStyle(color: Colors.redAccent, fontWeight: FontWeight.bold, fontFamily: 'monospace'),
                            ),
                            const SizedBox(height: 8),
                            Text(c['text']!, style: const TextStyle(color: Colors.white70)),
                          ],
                        ),
                      );
                    },
                  ),
                ),
                // Add Comment Input
                Padding(
                  padding: const EdgeInsets.all(16.0),
                  child: Row(
                    children: [
                      Expanded(
                        child: TextField(
                          controller: _commentCtrl,
                          style: const TextStyle(color: Colors.white),
                          decoration: const InputDecoration(
                            hintText: 'Add note at 01:23:45...',
                            hintStyle: TextStyle(color: Colors.white30),
                            border: OutlineInputBorder(borderSide: BorderSide(color: Colors.white24)),
                          ),
                          onSubmitted: (_) => _addComment(),
                        ),
                      ),
                      IconButton(
                        icon: const Icon(Icons.send, color: Colors.white),
                        onPressed: _addComment,
                      )
                    ],
                  ),
                ),
                // Approval Controls
                Padding(
                  padding: const EdgeInsets.all(16.0),
                  child: Column(
                    children: [
                      SizedBox(
                        width: double.infinity,
                        height: 50,
                        child: ElevatedButton(
                          style: ElevatedButton.styleFrom(
                            backgroundColor: Colors.transparent,
                            foregroundColor: Colors.white,
                            side: const BorderSide(color: Colors.white54),
                            shape: const RoundedRectangleBorder(borderRadius: BorderRadius.zero),
                          ),
                          onPressed: () {},
                          child: const Text('REQUEST CHANGES'),
                        ),
                      ),
                      const SizedBox(height: 12),
                      SizedBox(
                        width: double.infinity,
                        height: 50,
                        child: ElevatedButton(
                          style: ElevatedButton.styleFrom(
                            backgroundColor: Colors.white,
                            foregroundColor: Colors.black,
                            shape: const RoundedRectangleBorder(borderRadius: BorderRadius.zero),
                          ),
                          onPressed: () {},
                          child: const Text('APPROVE FOR EDITORIAL', style: TextStyle(fontWeight: FontWeight.bold)),
                        ),
                      ),
                    ],
                  ),
                )
              ],
            ),
          )
        ],
      ),
    );
  }
}
