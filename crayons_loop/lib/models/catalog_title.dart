class CatalogTitle {
  final int id;
  final String title;
  final int? duration;
  final String? language;
  final String? releaseDate;
  final String? streamUrl;

  CatalogTitle({
    required this.id,
    required this.title,
    this.duration,
    this.language,
    this.releaseDate,
    this.streamUrl,
  });

  factory CatalogTitle.fromJson(Map<String, dynamic> json) {
    return CatalogTitle(
      id: json['id'],
      title: json['title'],
      duration: json['duration'],
      language: json['language'],
      releaseDate: json['release_date'],
      streamUrl: json['stream_url'],
    );
  }
}
