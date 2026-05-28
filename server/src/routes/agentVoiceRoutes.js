import { Router } from 'express';
import path from 'node:path';
import fs from 'node:fs/promises';
import crypto from 'node:crypto';
import multer from 'multer';
import { body, param } from 'express-validator';

import { AgentVoice } from '../models/AgentVoice.js';
import { AGENTS_DIR, ensureDir } from '../config/paths.js';
import { ApiError, asyncHandler } from '../middleware/error.js';
import { validate } from '../middleware/validate.js';
import { requireAuth, requireRole } from '../middleware/auth.js';

const MAX_VIDEO_BYTES = 100 * 1024 * 1024; // 100 MB
const ALLOWED_VIDEO_MIME = new Set([
  'video/mp4',
  'video/quicktime',
  'video/webm',
  'video/x-m4v',
]);

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => {
    ensureDir(AGENTS_DIR);
    cb(null, AGENTS_DIR);
  },
  filename: (_req, file, cb) => {
    const key = crypto.randomBytes(12).toString('hex');
    const ext =
      path.extname(file.originalname || '').toLowerCase().replace(/[^a-z0-9.]/g, '') ||
      (file.mimetype === 'video/webm' ? '.webm' : '.mp4');
    cb(null, `${key}${ext}`);
  },
});

const upload = multer({
  storage,
  limits: { fileSize: MAX_VIDEO_BYTES, files: 1 },
  fileFilter: (_req, file, cb) => {
    if (!ALLOWED_VIDEO_MIME.has(file.mimetype)) {
      return cb(new ApiError(400, `Unsupported video type: ${file.mimetype}`));
    }
    cb(null, true);
  },
});

async function safeUnlink(storageKey) {
  if (!storageKey) return;
  try {
    await fs.unlink(path.join(AGENTS_DIR, storageKey));
  } catch (err) {
    if (err.code !== 'ENOENT') console.error('[agents] unlink failed', storageKey, err.message);
  }
}

const PUBLIC_FIELDS = '-videoStorageKey -__v';

export const agentVoiceRoutes = Router();

// Public: active agents, ordered
agentVoiceRoutes.get(
  '/',
  asyncHandler(async (_req, res) => {
    const items = await AgentVoice.find({ isActive: true })
      .sort({ order: 1, createdAt: 1 })
      .select(PUBLIC_FIELDS)
      .lean();
    res.json({ items });
  })
);

// Admin
agentVoiceRoutes.use(requireAuth, requireRole('admin', 'editor'));

agentVoiceRoutes.get(
  '/admin/all',
  asyncHandler(async (_req, res) => {
    const items = await AgentVoice.find()
      .sort({ order: 1, createdAt: 1 })
      .select(PUBLIC_FIELDS)
      .lean();
    res.json({ items });
  })
);

const baseValidators = [
  body('name').optional().isString().trim().isLength({ min: 1, max: 160 }),
  body('role').optional().isString().trim().isLength({ max: 160 }),
  body('desk').optional().isString().trim().isLength({ max: 80 }),
  body('quote').optional().isString().trim().isLength({ max: 600 }),
  body('isActive').optional().isBoolean().toBoolean(),
];

agentVoiceRoutes.post(
  '/',
  upload.single('video'),
  baseValidators,
  validate,
  asyncHandler(async (req, res) => {
    if (!req.file) throw new ApiError(400, 'Video file is required (field "video")');
    if (!req.body.name) {
      // Clean up uploaded file since we're rejecting the request
      await safeUnlink(req.file.filename);
      throw new ApiError(400, 'Name is required');
    }
    const last = await AgentVoice.findOne().sort({ order: -1 }).select('order').lean();
    const doc = await AgentVoice.create({
      name: req.body.name,
      role: req.body.role || '',
      desk: req.body.desk || '',
      quote: req.body.quote || '',
      videoUrl: `/uploads/agents/${req.file.filename}`,
      videoStorageKey: req.file.filename,
      mimeType: req.file.mimetype,
      bytes: req.file.size,
      isActive: req.body.isActive !== undefined ? req.body.isActive : true,
      order: (last?.order ?? -1) + 1,
    });
    res.status(201).json(doc);
  })
);

agentVoiceRoutes.patch(
  '/:id',
  [param('id').isMongoId()],
  upload.single('video'),
  baseValidators,
  validate,
  asyncHandler(async (req, res) => {
    const existing = await AgentVoice.findById(req.params.id);
    if (!existing) {
      if (req.file) await safeUnlink(req.file.filename);
      throw new ApiError(404, 'Agent voice not found');
    }
    for (const k of ['name', 'role', 'desk', 'quote', 'isActive']) {
      if (req.body[k] !== undefined) existing[k] = req.body[k];
    }
    if (req.file) {
      const oldKey = existing.videoStorageKey;
      existing.videoUrl = `/uploads/agents/${req.file.filename}`;
      existing.videoStorageKey = req.file.filename;
      existing.mimeType = req.file.mimetype;
      existing.bytes = req.file.size;
      await existing.save();
      await safeUnlink(oldKey);
    } else {
      await existing.save();
    }
    res.json(existing);
  })
);

agentVoiceRoutes.patch(
  '/reorder',
  [body('order').isArray({ min: 1 }), body('order.*').isMongoId()],
  validate,
  asyncHandler(async (req, res) => {
    const ids = req.body.order;
    const ops = ids.map((id, idx) => ({
      updateOne: { filter: { _id: id }, update: { order: idx } },
    }));
    await AgentVoice.bulkWrite(ops);
    const items = await AgentVoice.find()
      .sort({ order: 1 })
      .select(PUBLIC_FIELDS)
      .lean();
    res.json({ items });
  })
);

agentVoiceRoutes.delete(
  '/:id',
  [param('id').isMongoId()],
  validate,
  asyncHandler(async (req, res) => {
    const doc = await AgentVoice.findByIdAndDelete(req.params.id);
    if (!doc) throw new ApiError(404, 'Agent voice not found');
    await safeUnlink(doc.videoStorageKey);
    res.json({ ok: true, id: doc._id });
  })
);
