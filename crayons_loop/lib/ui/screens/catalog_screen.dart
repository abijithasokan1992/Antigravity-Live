import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../models/catalog_title.dart';
import '../../core/api_client.dart';

// Provider to fetch catalog
final catalogProvider = FutureProvider<List<CatalogTitle>>((ref) async {
  final dio = ref.read(dioProvider);
  final response = await dio.get('/catalog');
  return (response.data as List).map((json) => CatalogTitle.fromJson(json)).toList();
});

class CatalogScreen extends ConsumerWidget {
  const CatalogScreen({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final catalogAsync = ref.watch(catalogProvider);

    return Scaffold(
      backgroundColor: const Color(0xFF0A0A0A), // Deep Jet Black
      appBar: AppBar(
        backgroundColor: Colors.transparent,
        elevation: 0,
        title: const Text('Crayons Loop', style: TextStyle(color: Color(0xFFFF1E27), fontWeight: FontWeight.bold)), // Crimson Red
      ),
      body: catalogAsync.when(
        data: (titles) {
          if (titles.isEmpty) return const Center(child: Text("No titles available", style: TextStyle(color: Colors.white)));
          
          return CustomScrollView(
            slivers: [
              // Hero Banner
              SliverToBoxAdapter(
                child: Container(
                  height: 400,
                  decoration: BoxDecoration(
                    gradient: LinearGradient(
                      colors: [const Color(0xFF0A0A0A), Colors.grey[900]!],
                      begin: Alignment.bottomCenter,
                      end: Alignment.topCenter,
                    )
                  ),
                  child: Column(
                    mainAxisAlignment: MainAxisAlignment.end,
                    children: [
                      Text(titles.first.title, style: const TextStyle(color: Colors.white, fontSize: 32, fontWeight: FontWeight.bold)),
                      const SizedBox(height: 16),
                      ElevatedButton.icon(
                        style: ElevatedButton.styleFrom(
                          backgroundColor: const Color(0xFFFF1E27),
                          padding: const EdgeInsets.symmetric(horizontal: 32, vertical: 12)
                        ),
                        onPressed: () {
                          // TODO: Navigate to PlayerScreen
                        },
                        icon: const Icon(Icons.play_arrow, color: Colors.white),
                        label: const Text('Play Now', style: TextStyle(color: Colors.white, fontSize: 18)),
                      ),
                      const SizedBox(height: 32),
                    ],
                  )
                ),
              ),
              
              // Horizontal Carousel
              SliverToBoxAdapter(
                child: Padding(
                  padding: const EdgeInsets.all(16.0),
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      const Text("Trending", style: TextStyle(color: Colors.white, fontSize: 20, fontWeight: FontWeight.bold)),
                      const SizedBox(height: 16),
                      SizedBox(
                        height: 200,
                        child: ListView.builder(
                          scrollDirection: Axis.horizontal,
                          itemCount: titles.length,
                          itemBuilder: (context, index) {
                            final t = titles[index];
                            return GestureDetector(
                              onTap: () {
                                // TODO: Show TitleDetailsSheet
                              },
                              child: Container(
                                width: 140,
                                margin: const EdgeInsets.only(right: 16),
                                decoration: BoxDecoration(
                                  color: Colors.grey[850],
                                  borderRadius: BorderRadius.circular(8)
                                ),
                                child: Center(child: Text(t.title, textAlign: TextAlign.center, style: const TextStyle(color: Colors.white))),
                              ),
                            );
                          }
                        )
                      )
                    ],
                  ),
                )
              )
            ],
          );
        },
        loading: () => const Center(child: CircularProgressIndicator(color: Color(0xFFFF1E27))),
        error: (err, stack) => Center(child: Text('Error: $err', style: const TextStyle(color: Colors.white))),
      )
    );
  }
}
