import 'package:dio/dio.dart';

class StreamVistaApiClient {
  static final StreamVistaApiClient _instance = StreamVistaApiClient._internal();
  late final Dio dio;

  // Global Auth Token Store
  static String? authToken;

  factory StreamVistaApiClient() => _instance;

  StreamVistaApiClient._internal() {
    dio = Dio(
      BaseOptions(
        baseUrl: 'http://localhost:3000/api/v1',
        connectTimeout: const Duration(seconds: 15),
        receiveTimeout: const Duration(seconds: 15),
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
      ),
    );

    dio.interceptors.add(
      InterceptorsWrapper(
        onRequest: (options, handler) {
          if (authToken != null && authToken!.isNotEmpty) {
            options.headers['Authorization'] = 'Bearer $authToken';
          }
          return handler.next(options);
        },
        onResponse: (response, handler) {
          return handler.next(response);
        },
        onError: (DioException error, handler) async {
          if (error.response?.statusCode == 401) {
            // Global 401 Handling: Clear session / dispatch auth state update
            _handleUnauthorized();
          }
          return handler.next(error);
        },
      ),
    );
  }

  void _handleUnauthorized() {
    authToken = null;
    // Emit global event or navigate to AuthScreen
    print("401 Unauthorized - Token expired or invalid.");
  }
}
