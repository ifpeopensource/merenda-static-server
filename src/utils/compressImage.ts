import sharp from 'sharp';
import { createId as cuid } from '@paralleldrive/cuid2';

export default async function compressImage(
  imageBuffer: Buffer,
  outDir: string
) {
  const fileName = `${cuid()}.webp`;

  await sharp(imageBuffer)
    .webp({ quality: 20 })
    .toFile(`${outDir}/${fileName}`);

  return fileName;
}
