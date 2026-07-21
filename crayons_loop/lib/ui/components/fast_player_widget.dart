import 'package:flutter/material.dart';
import 'package:video_player/video_player.dart';
import 'package:chewie/chewie.dart';
import 'package:dio/dio.dart';

class FastPlayerWidget extends StatefulWidget {
  final String streamUrl;
  final String epgUrl;

  const FastPlayerWidget({
    super.key,
    this.streamUrl = 'https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8', // Fallback testing HLS
    this.epgUrl = 'http://localhost:3000/api/v1/fast/epg.xml',
  });

  @override
  State<FastPlayerWidget> createState() => _FastPlayerWidgetState();
}

class _FastPlayerWidgetState extends State<FastPlayerWidget> {
  late VideoPlayerController _videoPlayerController;
  ChewieController? _chewieController;
  
  String _currentProgramTitle = 'Loading EPG...';
  String _currentProgramDesc = '';
  
  final Dio _dio = Dio();

  @override
  void initState() {
    super.initState();
    _initializePlayer();
    _fetchEPG();
  }

  Future<void> _initializePlayer() async {
    _videoPlayerController = VideoPlayerController.networkUrl(Uri.parse(widget.streamUrl));
    await _videoPlayerController.initialize();
    
    _chewieController = ChewieController(
      videoPlayerController: _videoPlayerController,
      autoPlay: true,
      looping: true,
      isLive: true,
      showControls: true,
      customControls: const MaterialControls(), // Or customize for your brand
      placeholder: Container(
        color: Colors.black,
        child: const Center(child: CircularProgressIndicator(color: Colors.white)),
      ),
    );
    
    setState(() {});
  }

  Future<void> _fetchEPG() async {
    try {
      final response = await _dio.get(widget.epgUrl);
      if (response.statusCode == 200) {
        // Very basic XML parsing mockup - in production use xml package
        final xml = response.data.toString();
        if (xml.contains('<title lang="ml">')) {
           final start = xml.indexOf('<title lang="ml">') + 17;
           final end = xml.indexOf('</title>', start);
           if (start > 16 && end > start) {
             _currentProgramTitle = xml.substring(start, end);
           }
        }
        if (xml.contains('<desc lang="en">')) {
           final start = xml.indexOf('<desc lang="en">') + 16;
           final end = xml.indexOf('</desc>', start);
           if (start > 15 && end > start) {
             _currentProgramDesc = xml.substring(start, end);
           }
        }
        setState(() {});
      }
    } catch (e) {
      setState(() {
        _currentProgramTitle = 'Live Channel';
        _currentProgramDesc = 'Currently playing on Crayons Loop';
      });
    }
  }

  @override
  void dispose() {
    _videoPlayerController.dispose();
    _chewieController?.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return Container(
      decoration: BoxDecoration(
        border: Border.all(color: Colors.white, width: 1),
        color: Colors.black,
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.stretch,
        children: [
          // Player Header
          Container(
            padding: const EdgeInsets.all(16),
            color: Colors.white10,
            child: Row(
              children: [
                const Icon(Icons.live_tv, color: Colors.redAccent),
                const SizedBox(width: 8),
                const Text(
                  'CRAYONS LOOP LIVE',
                  style: TextStyle(color: Colors.white, fontWeight: FontWeight.bold, letterSpacing: 1.5),
                ),
                const Spacer(),
                Container(
                  padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
                  decoration: BoxDecoration(
                    color: Colors.redAccent,
                    borderRadius: BorderRadius.circular(4),
                  ),
                  child: const Text('LIVE', style: TextStyle(color: Colors.white, fontSize: 10, fontWeight: FontWeight.bold)),
                ),
              ],
            ),
          ),
          
          // Video Player
          AspectRatio(
            aspectRatio: 16 / 9,
            child: _chewieController != null && _chewieController!.videoPlayerController.value.isInitialized
                ? Chewie(controller: _chewieController!)
                : const Center(child: CircularProgressIndicator(color: Colors.white)),
          ),
          
          // EPG Info
          Container(
            padding: const EdgeInsets.all(16),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  'NOW PLAYING: $_currentProgramTitle',
                  style: const TextStyle(color: Colors.white, fontSize: 18, fontWeight: FontWeight.w900),
                ),
                const SizedBox(height: 8),
                Text(
                  _currentProgramDesc,
                  style: const TextStyle(color: Colors.white70, fontSize: 14),
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }
}
