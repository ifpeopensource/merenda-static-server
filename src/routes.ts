import { Router } from 'express';
import path from 'path';

import {
  fileTooLargeErrorHandler,
  uploadToDisk,
  uploadToMemory,
} from './middlewares/upload';

import compressImage from './utils/compressImage';

const staticFilesPath = path.join(
  __dirname,
  process.env.STATIC_FILES_PATH || './public'
);

export const routes = Router();

routes.post('/upload', uploadToDisk.single('file'), (request, response) => {
  const url = `${request.protocol}://${request.get('host')}/public/${
    request.file?.filename
  }`;

  return response.status(201).json({ url });
});

routes.post(
  '/upload/image',
  uploadToMemory.single('file'),
  async (request, response) => {
    if (!request.file) {
      return response.status(400).json({ error: 'No file provided' });
    }

    try {
      const { buffer } = request.file;

      const savedFileName = await compressImage(buffer, staticFilesPath);

      const url = `${request.protocol}://${request.get(
        'host'
      )}/public/${savedFileName}`;

      return response.status(201).json({ url });
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      if (error.message === 'Input buffer contains unsupported image format') {
        return response.status(400).json({
          error:
            'Unsupported file format. Supported formats: JPEG, PNG, WebP, GIF, AVIF, TIFF',
        });
      } else {
        return response.status(500).json({ error: 'Internal server error' });
      }
    }
  }
);

routes.use(fileTooLargeErrorHandler);
