import multer from 'multer';
import { createId as cuid } from '@paralleldrive/cuid2';
import path from 'path';
import { NextFunction, Request, Response } from 'express';

import { ContentLengthHeaderNotFound } from '../errors/ContentLengthHeaderNotFound';
import { FileTooLarge } from '../errors/FileTooLarge';
import { UnsupporteFileFormat } from '../errors/UnsupportedFileFormat';

const ACCEPTED_FILE_SIZE = 1024 * 1024 * 5; // 1024 Bytes (1KB) * 1024 (1MB) * 5 = 5MB
// Only JPEG, PNG, WebP, GIF, AVIF or TIFF are supported
const SUPPORTED_FILE_EXTENSIONS = [
  '.jpg',
  '.jpeg',
  '.png',
  '.webp',
  '.gif',
  '.avif',
  '.tiff',
];

const staticFilesPath = path.join(
  __dirname,
  '..',
  process.env.STATIC_FILES_PATH || './public'
);

const diskStorage = multer.diskStorage({
  destination: staticFilesPath,
  filename(_request, file, callback) {
    const newFileName = cuid() + path.extname(file.originalname);
    callback(null, newFileName);
  },
});

const memoryStorage = multer.memoryStorage();

export const uploadToDisk = multer({
  storage: diskStorage,
  limits: {
    fileSize: ACCEPTED_FILE_SIZE,
  },
  fileFilter: (request, _file, callback) => {
    if (!request.headers['content-length']) {
      callback(new ContentLengthHeaderNotFound());
    }

    const fileSize = Number(request.headers['content-length']);

    if (fileSize > ACCEPTED_FILE_SIZE) {
      callback(new FileTooLarge());
    }

    callback(null, true);
  },
});

export const uploadToMemory = multer({
  storage: memoryStorage,
  limits: {
    fileSize: ACCEPTED_FILE_SIZE,
  },
  fileFilter: (request, file, callback) => {
    if (!request.headers['content-length']) {
      callback(new ContentLengthHeaderNotFound());
    }

    const fileSize = Number(request.headers['content-length']);

    if (fileSize > ACCEPTED_FILE_SIZE) {
      callback(new FileTooLarge());
    }

    if (!SUPPORTED_FILE_EXTENSIONS.includes(path.extname(file.originalname))) {
      callback(new UnsupporteFileFormat());
    }

    callback(null, true);
  },
});

export function fileTooLargeErrorHandler(
  error: Error,
  _request: Request,
  response: Response,
  next: NextFunction
) {
  if (error instanceof ContentLengthHeaderNotFound) {
    return response.status(400).json({ error: error.message });
  }

  if (error instanceof FileTooLarge) {
    return response.status(400).json({ error: error.message });
  }

  if (error instanceof UnsupporteFileFormat) {
    return response.status(400).json({ error: error.message });
  }

  next(error);
}
