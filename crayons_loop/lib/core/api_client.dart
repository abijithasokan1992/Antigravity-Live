import 'package:dio/dio.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';

// API Key should be injected at build time: --dart-define=CRAYONS_LOOP_API_KEY=your_key
const String _apiKey = String.fromEnvironment(
  'CRAYONS_LOOP_API_KEY',
  defaultValue: 'mock-key-for-dev',
);

// Riverpod Provider for Dio
final dioProvider = Provider<Dio>((ref) {
  final dio = Dio(
    BaseOptions(
      baseUrl: 'http://localhost:3000/api/public-bridge',
      headers: {
        'x-api-key': _apiKey,
      },
      connectTimeout: const Duration(seconds: 10),
    ),
  );

  // Optional: Add logging interceptor for dev
  dio.interceptors.add(LogInterceptor(responseBody: true));
  
  return dio;
});
