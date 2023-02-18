export class ContentLengthHeaderNotFound extends Error {
  static message = 'File is too large. Max size is 5MB';

  constructor() {
    super(ContentLengthHeaderNotFound.message);
  }
}
