import { Router } from 'express';
import path from 'node:path';
import fs from 'node:fs/promises';
import multer from 'multer';
import { body, param, query } from 'express-validator';

import { Testimonial, ALLOWED_TESTIMONIAL_DESTINATIONS } from '../models/Testimonial.js';
import { UPLOADS_DIR, ensureDir } from '../config/paths.js';
import { ApiError, asyncHandler } from '../middleware/error.js';
import { validate } from '../middleware/validate.js';
import { requireAuth, requireRole } from '../middleware/auth.js';
import { ALLOWED_MIME, processImage, randomKey } from '../utils/imageProcessor.js';

const MAX_UPLOAD_BYTES = 8 * 1024 * 1024; // 8MB avatars
const TESTIMONIALS_DIR = path.join(UPLOADS_DIR, 'testimonials');
ensureDir(TESTIMONIALS_DIR);

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: MAX_UPLOAD_BYTES, files: 1 },
  fileFilter: (_req, file, cb) => {
    if (!ALLOWED_MIME.has(file.mimetype)) {
      return cb(new ApiError(400, `Unsupported file type: ${file.mimetype}`));
    }
    cb(null, true);
  },
});

const PUBLIC_FIELDS = '-avatarStorageKey -avatarThumbStorageKey -__v';

async function safeUnlink(storageKey) {
  if (!storageKey) return;
  try {
    await fs.unlink(path.join(TESTIMONIALS_DIR, storageKey));
  } catch (err) {
    if (err.code !== 'ENOENT') console.error('[testimonials] unlink failed', storageKey, err.message);
  }
}

export const testimonialRoutes = Router();

// Public: approved testimonials, optionally filtered by destination
testimonialRoutes.get(
  '/',
  [query('destinationId').optional().isIn(ALLOWED_TESTIMONIAL_DESTINATIONS)],
  validate,
  asyncHandler(async (req, res) => {
    const filter = { isApproved: true };
    if (req.query.destinationId) filter.destinationId = req.query.destinationId;
    const items = await Testimonial.find(filter)
      .sort({ isFeatured: -1, order: 1, createdAt: -1 })
      .select(PUBLIC_FIELDS)
      .lean();
    res.json({ items });
  })
);

// Public submission — lands unapproved
testimonialRoutes.post(
  '/submit',
  [
    body('name').isString().trim().isLength({ min: 1, max: 160 }),
    body('message').isString().trim().isLength({ min: 5, max: 2000 }),
    body('rating').optional().isInt({ min: 1, max: 5 }),
    body('destinationId').optional().isIn(ALLOWED_TESTIMONIAL_DESTINATIONS),
  ],
  validate,
  asyncHandler(async (req, res) => {
    const t = await Testimonial.create({
      name: req.body.name,
      message: req.body.message,
      rating: req.body.rating || 5,
      location: req.body.location || '',
      tripType: req.body.tripType || '',
      tripDate: req.body.tripDate || '',
      destinationId: req.body.destinationId || '',
      isApproved: false,
    });
    res.status(201).json({ ok: true, id: t._id });
  })
);

// Admin
testimonialRoutes.use(requireAuth, requireRole('admin', 'editor'));

testimonialRoutes.get(
  '/admin/all',
  [
    query('destinationId').optional().isString(),
    query('status').optional().isIn(['approved', 'pending', 'all']),
  ],
  validate,
  asyncHandler(async (req, res) => {
    const filter = {};
    if (req.query.destinationId && req.query.destinationId !== 'all') {
      filter.destinationId = req.query.destinationId;
    }
    if (req.query.status === 'approved') filter.isApproved = true;
    if (req.query.status === 'pending') filter.isApproved = false;
    const items = await Testimonial.find(filter)
      .sort({ destinationId: 1, order: 1, createdAt: -1 })
      .select(PUBLIC_FIELDS)
      .lean();
    res.json({ items });
  })
);

// Admin: upload reviewer avatar (returns URL keys to attach)
testimonialRoutes.post(
  '/admin/avatar',
  upload.single('image'),
  asyncHandler(async (req, res) => {
    if (!req.file) throw new ApiError(400, 'No file uploaded (field name must be "image")');
    const baseKey = randomKey();
    const processed = await processImage(req.file.buffer, TESTIMONIALS_DIR, baseKey, {
      maxWidth: 400,
      thumbWidth: 160,
    });
    res.status(201).json({
      avatarUrl: `/uploads/testimonials/${processed.fullName}`,
      avatarThumbUrl: `/uploads/testimonials/${processed.thumbName}`,
      avatarStorageKey: processed.fullName,
      avatarThumbStorageKey: processed.thumbName,
    });
  })
);

const baseValidators = [
  body('name').optional().isString().trim().isLength({ min: 1, max: 160 }),
  body('location').optional().isString().trim().isLength({ max: 160 }),
  body('rating').optional().isInt({ min: 1, max: 5 }).toInt(),
  body('message').optional().isString().trim().isLength({ min: 1, max: 2000 }),
  body('tripType').optional().isString().trim().isLength({ max: 80 }),
  body('tripDate').optional().isString().trim().isLength({ max: 60 }),
  body('destinationId').optional().custom((v) => v === '' || ALLOWED_TESTIMONIAL_DESTINATIONS.includes(v)),
  body('isApproved').optional().isBoolean().toBoolean(),
  body('isFeatured').optional().isBoolean().toBoolean(),
  body('avatarUrl').optional().isString().isLength({ max: 500 }),
  body('avatarThumbUrl').optional().isString().isLength({ max: 500 }),
  body('avatarStorageKey').optional().isString().isLength({ max: 200 }),
  body('avatarThumbStorageKey').optional().isString().isLength({ max: 200 }),
];

testimonialRoutes.post(
  '/',
  baseValidators,
  validate,
  asyncHandler(async (req, res) => {
    if (!req.body.name) throw new ApiError(400, 'Name is required');
    if (!req.body.message) throw new ApiError(400, 'Message is required');
    const last = await Testimonial.findOne({ destinationId: req.body.destinationId || '' })
      .sort({ order: -1 })
      .select('order')
      .lean();
    const doc = await Testimonial.create({
      ...req.body,
      isApproved: req.body.isApproved !== undefined ? req.body.isApproved : true,
      order: (last?.order ?? -1) + 1,
    });
    res.status(201).json(doc);
  })
);

testimonialRoutes.patch(
  '/:id',
  [param('id').isMongoId(), ...baseValidators],
  validate,
  asyncHandler(async (req, res) => {
    const existing = await Testimonial.findById(req.params.id);
    if (!existing) throw new ApiError(404, 'Testimonial not found');

    // If avatar replaced, drop old files
    const incomingKey = req.body.avatarStorageKey;
    if (incomingKey && existing.avatarStorageKey && incomingKey !== existing.avatarStorageKey) {
      await safeUnlink(existing.avatarStorageKey);
      await safeUnlink(existing.avatarThumbStorageKey);
    }

    for (const k of [
      'name', 'location', 'rating', 'message', 'tripType', 'tripDate',
      'destinationId', 'isApproved', 'isFeatured', 'order',
      'avatarUrl', 'avatarThumbUrl', 'avatarStorageKey', 'avatarThumbStorageKey',
    ]) {
      if (req.body[k] !== undefined) existing[k] = req.body[k];
    }
    await existing.save();
    res.json(existing);
  })
);

testimonialRoutes.patch(
  '/reorder',
  [body('destinationId').isIn(['', ...ALLOWED_TESTIMONIAL_DESTINATIONS]), body('order').isArray({ min: 1 })],
  validate,
  asyncHandler(async (req, res) => {
    const ops = req.body.order.map((id, idx) => ({
      updateOne: { filter: { _id: id }, update: { order: idx } },
    }));
    await Testimonial.bulkWrite(ops);
    res.json({ ok: true });
  })
);

testimonialRoutes.delete(
  '/:id',
  [param('id').isMongoId()],
  validate,
  asyncHandler(async (req, res) => {
    const doc = await Testimonial.findByIdAndDelete(req.params.id);
    if (!doc) throw new ApiError(404, 'Testimonial not found');
    await safeUnlink(doc.avatarStorageKey);
    await safeUnlink(doc.avatarThumbStorageKey);
    res.json({ ok: true, id: doc._id });
  })
);
