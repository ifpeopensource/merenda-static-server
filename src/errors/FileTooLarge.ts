export class FileTooLarge extends Error {
  static message = 'File too large. Max file size is 5MB.';

  constructor() {
    super(FileTooLarge.message);
  }
}
