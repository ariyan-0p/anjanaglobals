import path from 'node:path';
import crypto from 'node:crypto';
import sharp from 'sharp';

export const ALLOWED_MIME = new Set(['image/jpeg', 'image/png', 'image/webp', 'image/gif']);

export function randomKey() {
  return crypto.randomBytes(12).toString('hex');
}

/**
 * Process an image buffer: produce a full-size webp (max width) and a thumbnail.
 * Returns metadata + filenames written into destDir.
 */
export async function processImage(buffer, destDir, baseKey, opts = {}) {
  const { maxWidth = 1920, thumbWidth = 480, fullQuality = 82, thumbQuality = 75 } = opts;

  const meta = await sharp(buffer, { failOn: 'none' }).rotate().metadata();

  const fullName = `${baseKey}.webp`;
  const thumbName = `${baseKey}_thumb.webp`;
  const fullPath = path.join(destDir, fullName);
  const thumbPath = path.join(destDir, thumbName);

  const fullPipeline = sharp(buffer, { failOn: 'none' }).rotate();
  if (meta.width && meta.width > maxWidth) {
    fullPipeline.resize({ width: maxWidth, withoutEnlargement: true });
  }
  const fullInfo = await fullPipeline.webp({ quality: fullQuality }).toFile(fullPath);

  await sharp(buffer, { failOn: 'none' })
    .rotate()
    .resize({ width: thumbWidth, withoutEnlargement: true })
    .webp({ quality: thumbQuality })
    .toFile(thumbPath);

  return {
    fullName,
    thumbName,
    width: fullInfo.width,
    height: fullInfo.height,
    bytes: fullInfo.size,
  };
}
