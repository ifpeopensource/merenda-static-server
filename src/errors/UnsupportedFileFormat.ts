export class UnsupporteFileFormat extends Error {
  static message =
    'Unsupported file format. Supported formats: JPEG, PNG, WebP, GIF, AVIF, TIFF';

  constructor() {
    super(UnsupporteFileFormat.message);
  }
}
