import 'package:flutter/material.dart';
import '../../core/api/dio_client.dart';

class MessageThreadsPanel extends StatefulWidget {
  final String titleId;
  
  const MessageThreadsPanel({super.key, required this.titleId});

  @override
  State<MessageThreadsPanel> createState() => _MessageThreadsPanelState();
}

class _MessageThreadsPanelState extends State<MessageThreadsPanel> {
  bool _isLoading = true;
  String? _error;
  List<dynamic> _threads = [];
  String? _selectedThreadId;
  final TextEditingController _replyCtrl = TextEditingController();

  @override
  void initState() {
    super.initState();
    _fetchThreads();
  }

  Future<void> _fetchThreads() async {
    try {
      final response = await StreamVistaApiClient().dio.get('/phase1/titles/${widget.titleId}/threads');
      setState(() {
        _threads = response.data;
        if (_threads.isNotEmpty) {
          _selectedThreadId = _threads.first['id'];
        }
        _isLoading = false;
      });
    } catch (e) {
      setState(() {
        _error = e.toString();
        _isLoading = false;
      });
    }
  }

  Future<void> _sendMessage() async {
    final text = _replyCtrl.text.trim();
    if (text.isEmpty || _selectedThreadId == null) return;
    
    _replyCtrl.clear();
    try {
      await StreamVistaApiClient().dio.post('/phase1/threads/$_selectedThreadId/messages', 
        data: {'message': text, 'isSystemEvent': false},
      );
      // Optimistically reload threads
      _fetchThreads();
    } catch (e) {
      // ignore
    }
  }

  @override
  Widget build(BuildContext context) {
    if (_isLoading) {
      return Container(
        height: 600,
        decoration: BoxDecoration(color: Colors.black, border: Border.all(color: Colors.white24)),
        child: const Center(child: CircularProgressIndicator(color: Colors.white)),
      );
    }

    if (_error != null) {
      return Container(
        height: 600,
        decoration: BoxDecoration(color: Colors.black, border: Border.all(color: Colors.red)),
        child: Center(child: Text('Error: $_error', style: const TextStyle(color: Colors.red))),
      );
    }

    if (_threads.isEmpty) {
       return Container(
        height: 600,
        decoration: BoxDecoration(color: Colors.black, border: Border.all(color: Colors.white24)),
        child: const Center(child: Text('No active threads', style: TextStyle(color: Colors.white54))),
      );
    }

    final selectedThread = _threads.firstWhere((t) => t['id'] == _selectedThreadId, orElse: () => _threads.first);
    final messages = selectedThread['messages'] as List<dynamic>? ?? [];

    return Container(
      height: 600,
      decoration: BoxDecoration(
        color: Colors.black,
        border: Border.all(color: Colors.white24),
        borderRadius: BorderRadius.circular(4),
      ),
      child: Row(
        children: [
          // Thread List
          Expanded(
            flex: 1,
            child: Container(
              decoration: const BoxDecoration(
                border: Border(right: BorderSide(color: Colors.white24)),
              ),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.stretch,
                children: [
                  const Padding(
                    padding: EdgeInsets.all(16.0),
                    child: Text('ACTIVE CONVERSATIONS', style: TextStyle(color: Colors.white, fontSize: 12, fontWeight: FontWeight.bold, letterSpacing: 1.5)),
                  ),
                  const Divider(color: Colors.white24, height: 1),
                  Expanded(
                    child: ListView.separated(
                      itemCount: _threads.length,
                      separatorBuilder: (c, i) => const Divider(color: Colors.white12, height: 1),
                      itemBuilder: (c, i) {
                        final t = _threads[i];
                        final isSelected = t['id'] == _selectedThreadId;
                        return InkWell(
                          onTap: () => setState(() => _selectedThreadId = t['id']),
                          child: Container(
                            color: isSelected ? Colors.white12 : Colors.transparent,
                            padding: const EdgeInsets.all(16.0),
                            child: Column(
                              crossAxisAlignment: CrossAxisAlignment.start,
                              children: [
                                Row(
                                  children: [
                                    if (t['unread'] == true)
                                      Container(
                                        width: 8, height: 8,
                                        margin: const EdgeInsets.only(right: 8),
                                        decoration: const BoxDecoration(color: Colors.white, shape: BoxShape.circle),
                                      ),
                                    Expanded(
                                      child: Text(t['buyer_name'] ?? 'Unknown', style: const TextStyle(color: Colors.white, fontWeight: FontWeight.bold, fontSize: 13)),
                                    ),
                                    Text(t['last_activity'] ?? '', style: const TextStyle(color: Colors.white54, fontSize: 10)),
                                  ],
                                ),
                                const SizedBox(height: 6),
                                Text(t['subject'] ?? '', style: const TextStyle(color: Colors.white70, fontSize: 12), maxLines: 1, overflow: TextOverflow.ellipsis),
                              ],
                            ),
                          ),
                        );
                      },
                    ),
                  ),
                ],
              ),
            ),
          ),
          
          // Messages View
          Expanded(
            flex: 2,
            child: Column(
              children: [
                // Header
                Container(
                  padding: const EdgeInsets.symmetric(horizontal: 20, vertical: 16),
                  decoration: const BoxDecoration(border: Border(bottom: BorderSide(color: Colors.white24))),
                  child: Row(
                    children: [
                      Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Text(selectedThread['buyer_name'] ?? '', style: const TextStyle(color: Colors.white, fontSize: 14, fontWeight: FontWeight.bold)),
                          const SizedBox(height: 4),
                          Text(selectedThread['subject'] ?? '', style: const TextStyle(color: Colors.white54, fontSize: 12)),
                        ],
                      ),
                      const Spacer(),
                      OutlinedButton.icon(
                        onPressed: () {},
                        icon: const Icon(Icons.attach_file, size: 14, color: Colors.white),
                        label: const Text('REQUEST FILE', style: TextStyle(color: Colors.white, fontSize: 10, letterSpacing: 1)),
                        style: OutlinedButton.styleFrom(
                          side: const BorderSide(color: Colors.white24),
                          shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(2)),
                        ),
                      )
                    ],
                  ),
                ),
                
                // Message List
                Expanded(
                  child: ListView.builder(
                    padding: const EdgeInsets.all(24),
                    itemCount: messages.length,
                    itemBuilder: (context, index) {
                      final msg = messages[index];
                      final isSystem = msg['is_system'] == true;
                      final isMe = msg['sender'] == 'You';
                      
                      if (isSystem) {
                        return Padding(
                          padding: const EdgeInsets.symmetric(vertical: 16),
                          child: Center(
                            child: Container(
                              padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
                              decoration: BoxDecoration(border: Border.all(color: Colors.white24), borderRadius: BorderRadius.circular(16)),
                              child: Text(msg['body'] ?? '', style: const TextStyle(color: Colors.white70, fontSize: 11, fontStyle: FontStyle.italic)),
                            ),
                          ),
                        );
                      }
                      
                      return Padding(
                        padding: const EdgeInsets.only(bottom: 24),
                        child: Row(
                          mainAxisAlignment: isMe ? MainAxisAlignment.end : MainAxisAlignment.start,
                          crossAxisAlignment: CrossAxisAlignment.end,
                          children: [
                            if (!isMe)
                              CircleAvatar(radius: 14, backgroundColor: Colors.white12, child: Text((msg['sender'] ?? '?')[0], style: const TextStyle(color: Colors.white, fontSize: 12))),
                            if (!isMe) const SizedBox(width: 12),
                            
                            Flexible(
                              child: Container(
                                padding: const EdgeInsets.all(16),
                                decoration: BoxDecoration(
                                  color: isMe ? Colors.white12 : Colors.transparent,
                                  border: Border.all(color: isMe ? Colors.transparent : Colors.white24),
                                  borderRadius: BorderRadius.circular(8).copyWith(
                                    bottomRight: isMe ? const Radius.circular(0) : const Radius.circular(8),
                                    bottomLeft: !isMe ? const Radius.circular(0) : const Radius.circular(8),
                                  ),
                                ),
                                child: Column(
                                  crossAxisAlignment: CrossAxisAlignment.start,
                                  children: [
                                    Text(msg['body'] ?? '', style: const TextStyle(color: Colors.white, fontSize: 13, height: 1.4)),
                                    const SizedBox(height: 8),
                                    Text(msg['time']?.toString().substring(0,10) ?? '', style: const TextStyle(color: Colors.white38, fontSize: 10)),
                                  ],
                                ),
                              ),
                            ),
                            
                            if (isMe) const SizedBox(width: 12),
                            if (isMe)
                               CircleAvatar(radius: 14, backgroundColor: Colors.white, child: const Text('U', style: TextStyle(color: Colors.black, fontSize: 12, fontWeight: FontWeight.bold))),
                          ],
                        ),
                      );
                    },
                  ),
                ),
                
                // Compose Box
                Container(
                  padding: const EdgeInsets.all(16),
                  decoration: const BoxDecoration(border: Border(top: BorderSide(color: Colors.white24))),
                  child: Row(
                    children: [
                      Expanded(
                        child: TextField(
                          controller: _replyCtrl,
                          style: const TextStyle(color: Colors.white, fontSize: 13),
                          decoration: const InputDecoration(
                            hintText: 'Type your reply...',
                            hintStyle: TextStyle(color: Colors.white38),
                            border: InputBorder.none,
                          ),
                          onSubmitted: (_) => _sendMessage(),
                        ),
                      ),
                      IconButton(
                        icon: const Icon(Icons.send, color: Colors.white),
                        onPressed: _sendMessage,
                      )
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
