import { Router } from 'express';
import path from 'node:path';
import fs from 'node:fs/promises';
import crypto from 'node:crypto';
import multer from 'multer';
import sharp from 'sharp';
import { body, param } from 'express-validator';

import { GalleryImage, ALLOWED_GALLERY_DESTINATIONS } from '../models/GalleryImage.js';
import { GALLERIES_DIR, ensureDir } from '../config/paths.js';
import { ApiError, asyncHandler } from '../middleware/error.js';
import { validate } from '../middleware/validate.js';
import { requireAuth, requireRole } from '../middleware/auth.js';

const MAX_UPLOAD_BYTES = 15 * 1024 * 1024; // 15MB per file
const MAX_FILES_PER_REQUEST = 20;
const MAX_WIDTH = 1920;
const THUMB_WIDTH = 480;
const ALLOWED_MIME = new Set(['image/jpeg', 'image/png', 'image/webp', 'image/gif']);

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: MAX_UPLOAD_BYTES, files: MAX_FILES_PER_REQUEST },
  fileFilter: (_req, file, cb) => {
    if (!ALLOWED_MIME.has(file.mimetype)) {
      return cb(new ApiError(400, `Unsupported file type: ${file.mimetype}`));
    }
    cb(null, true);
  },
});

function assertDestination(destinationId) {
  if (!ALLOWED_GALLERY_DESTINATIONS.includes(destinationId)) {
    throw new ApiError(400, `Unknown destination: ${destinationId}`);
  }
}

function randomKey() {
  return crypto.randomBytes(12).toString('hex');
}

async function processImage(buffer, destDir, baseKey) {
  const image = sharp(buffer, { failOn: 'none' }).rotate();
  const meta = await image.metadata();

  const fullName = `${baseKey}.webp`;
  const thumbName = `${baseKey}_thumb.webp`;
  const fullPath = path.join(destDir, fullName);
  const thumbPath = path.join(destDir, thumbName);

  const fullPipeline = sharp(buffer, { failOn: 'none' }).rotate();
  if (meta.width && meta.width > MAX_WIDTH) {
    fullPipeline.resize({ width: MAX_WIDTH, withoutEnlargement: true });
  }
  const fullInfo = await fullPipeline.webp({ quality: 82 }).toFile(fullPath);

  await sharp(buffer, { failOn: 'none' })
    .rotate()
    .resize({ width: THUMB_WIDTH, withoutEnlargement: true })
    .webp({ quality: 75 })
    .toFile(thumbPath);

  return {
    fullName,
    thumbName,
    width: fullInfo.width,
    height: fullInfo.height,
    bytes: fullInfo.size,
  };
}

async function safeUnlink(absPath) {
  try {
    await fs.unlink(absPath);
  } catch (err) {
    if (err.code !== 'ENOENT') console.error('[gallery] unlink failed', absPath, err);
  }
}

export const galleryRoutes = Router();

// Public: list images for a destination (ordered)
galleryRoutes.get(
  '/:destinationId',
  [param('destinationId').isString()],
  validate,
  asyncHandler(async (req, res) => {
    const { destinationId } = req.params;
    assertDestination(destinationId);
    const items = await GalleryImage.find({ destinationId })
      .sort({ order: 1, createdAt: 1 })
      .select('-storageKey -thumbStorageKey -__v')
      .lean();
    res.json({ destinationId, items });
  })
);

// Public: list all destinations summary (counts + first image)
galleryRoutes.get(
  '/',
  asyncHandler(async (_req, res) => {
    const items = await GalleryImage.find()
      .sort({ destinationId: 1, order: 1, createdAt: 1 })
      .select('-storageKey -thumbStorageKey -__v')
      .lean();
    const byDest = ALLOWED_GALLERY_DESTINATIONS.reduce((acc, id) => {
      acc[id] = items.filter((i) => i.destinationId === id);
      return acc;
    }, {});
    res.json({ destinations: byDest });
  })
);

// Admin routes below
galleryRoutes.use(requireAuth, requireRole('admin', 'editor'));

// Upload one or more images to a destination
galleryRoutes.post(
  '/:destinationId/images',
  [param('destinationId').isString()],
  validate,
  upload.array('images', MAX_FILES_PER_REQUEST),
  asyncHandler(async (req, res) => {
    const { destinationId } = req.params;
    assertDestination(destinationId);
    const files = req.files || [];
    if (!files.length) throw new ApiError(400, 'No files uploaded (field name must be "images")');

    const destDir = path.join(GALLERIES_DIR, destinationId);
    ensureDir(destDir);

    const lastOrderDoc = await GalleryImage.findOne({ destinationId })
      .sort({ order: -1 })
      .select('order')
      .lean();
    let nextOrder = (lastOrderDoc?.order ?? -1) + 1;

    const created = [];
    for (const file of files) {
      const baseKey = randomKey();
      const processed = await processImage(file.buffer, destDir, baseKey);
      const doc = await GalleryImage.create({
        destinationId,
        url: `/uploads/galleries/${destinationId}/${processed.fullName}`,
        thumbUrl: `/uploads/galleries/${destinationId}/${processed.thumbName}`,
        width: processed.width,
        height: processed.height,
        bytes: processed.bytes,
        order: nextOrder++,
        storageKey: processed.fullName,
        thumbStorageKey: processed.thumbName,
        alt: '',
        caption: '',
      });
      created.push(doc.toObject());
    }

    res.status(201).json({ items: created });
  })
);

// Update caption / alt / order of a single image
galleryRoutes.patch(
  '/:destinationId/images/:id',
  [
    param('destinationId').isString(),
    param('id').isMongoId(),
    body('caption').optional().isString().isLength({ max: 240 }),
    body('alt').optional().isString().isLength({ max: 240 }),
    body('order').optional().isInt({ min: 0 }),
  ],
  validate,
  asyncHandler(async (req, res) => {
    const { destinationId, id } = req.params;
    assertDestination(destinationId);
    const patch = {};
    for (const k of ['caption', 'alt', 'order']) {
      if (req.body[k] !== undefined) patch[k] = req.body[k];
    }
    const doc = await GalleryImage.findOneAndUpdate(
      { _id: id, destinationId },
      patch,
      { new: true }
    );
    if (!doc) throw new ApiError(404, 'Image not found');
    res.json(doc);
  })
);

// Bulk reorder for a destination: body { order: [id1, id2, ...] }
galleryRoutes.patch(
  '/:destinationId/reorder',
  [
    param('destinationId').isString(),
    body('order').isArray({ min: 1 }),
    body('order.*').isMongoId(),
  ],
  validate,
  asyncHandler(async (req, res) => {
    const { destinationId } = req.params;
    assertDestination(destinationId);
    const ids = req.body.order;
    const ops = ids.map((id, idx) => ({
      updateOne: {
        filter: { _id: id, destinationId },
        update: { order: idx },
      },
    }));
    await GalleryImage.bulkWrite(ops);
    const items = await GalleryImage.find({ destinationId }).sort({ order: 1 }).lean();
    res.json({ destinationId, items });
  })
);

// Delete one image
galleryRoutes.delete(
  '/:destinationId/images/:id',
  [param('destinationId').isString(), param('id').isMongoId()],
  validate,
  asyncHandler(async (req, res) => {
    const { destinationId, id } = req.params;
    assertDestination(destinationId);
    const doc = await GalleryImage.findOneAndDelete({ _id: id, destinationId });
    if (!doc) throw new ApiError(404, 'Image not found');
    const destDir = path.join(GALLERIES_DIR, destinationId);
    await safeUnlink(path.join(destDir, doc.storageKey));
    await safeUnlink(path.join(destDir, doc.thumbStorageKey));
    res.json({ ok: true, id });
  })
);
