import { Router } from 'express';
import { body, param, query } from 'express-validator';
import multer from 'multer';
import path from 'node:path';
import fs from 'node:fs/promises';

import { BlogPost } from '../models/BlogPost.js';
import { ApiError, asyncHandler } from '../middleware/error.js';
import { validate } from '../middleware/validate.js';
import { requireAuth, requireRole } from '../middleware/auth.js';
import { BLOG_DIR, ensureDir } from '../config/paths.js';
import { ALLOWED_MIME, processImage, randomKey } from '../utils/imageProcessor.js';
import { slugify, uniqueSlug } from '../utils/slug.js';

const MAX_UPLOAD_BYTES = 15 * 1024 * 1024;

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

const PUBLIC_FIELDS = '-coverStorageKey -coverThumbStorageKey -__v';

export const blogRoutes = Router();

// Public: list published posts (paginated, optional search + category)
blogRoutes.get(
  '/',
  [
    query('page').optional().isInt({ min: 1 }),
    query('limit').optional().isInt({ min: 1, max: 50 }),
    query('q').optional().isString().isLength({ max: 120 }),
    query('category').optional().isString().isLength({ max: 80 }),
  ],
  validate,
  asyncHandler(async (req, res) => {
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 12;
    const filter = { status: 'published' };
    if (req.query.category) filter.category = req.query.category;
    if (req.query.q) {
      filter.$or = [
        { title: { $regex: req.query.q, $options: 'i' } },
        { excerpt: { $regex: req.query.q, $options: 'i' } },
      ];
    }
    const [items, total, categories] = await Promise.all([
      BlogPost.find(filter)
        .sort({ publishedAt: -1, createdAt: -1 })
        .skip((page - 1) * limit)
        .limit(limit)
        .select(`${PUBLIC_FIELDS} -body`)
        .lean(),
      BlogPost.countDocuments(filter),
      BlogPost.distinct('category', { status: 'published', category: { $ne: '' } }),
    ]);
    res.json({
      items,
      total,
      page,
      limit,
      pages: Math.ceil(total / limit),
      categories: categories.sort(),
    });
  })
);

// Public: get by slug
blogRoutes.get(
  '/:slug',
  [param('slug').isString().isLength({ min: 1, max: 160 })],
  validate,
  asyncHandler(async (req, res) => {
    const post = await BlogPost.findOne({ slug: req.params.slug, status: 'published' })
      .select(PUBLIC_FIELDS)
      .lean();
    if (!post) throw new ApiError(404, 'Post not found');

    // Related posts: same category, exclude this post
    const related = await BlogPost.find({
      status: 'published',
      _id: { $ne: post._id },
      ...(post.category ? { category: post.category } : {}),
    })
      .sort({ publishedAt: -1 })
      .limit(3)
      .select(`${PUBLIC_FIELDS} -body`)
      .lean();
    res.json({ post, related });
  })
);

// Admin
blogRoutes.use(requireAuth, requireRole('admin', 'editor'));

// Admin list (all statuses)
blogRoutes.get(
  '/admin/all',
  [
    query('page').optional().isInt({ min: 1 }),
    query('limit').optional().isInt({ min: 1, max: 100 }),
    query('q').optional().isString().isLength({ max: 120 }),
    query('status').optional().isIn(['published', 'draft', 'all']),
  ],
  validate,
  asyncHandler(async (req, res) => {
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 30;
    const filter = {};
    if (req.query.status && req.query.status !== 'all') filter.status = req.query.status;
    if (req.query.q) {
      filter.$or = [
        { title: { $regex: req.query.q, $options: 'i' } },
        { slug: { $regex: req.query.q, $options: 'i' } },
      ];
    }
    const [items, total] = await Promise.all([
      BlogPost.find(filter)
        .sort({ publishedAt: -1, createdAt: -1 })
        .skip((page - 1) * limit)
        .limit(limit)
        .select(`${PUBLIC_FIELDS} -body`)
        .lean(),
      BlogPost.countDocuments(filter),
    ]);
    res.json({ items, total, page, limit, pages: Math.ceil(total / limit) });
  })
);

// Admin: get one (by id) - includes body
blogRoutes.get(
  '/admin/:id',
  [param('id').isMongoId()],
  validate,
  asyncHandler(async (req, res) => {
    const post = await BlogPost.findById(req.params.id).select(PUBLIC_FIELDS).lean();
    if (!post) throw new ApiError(404, 'Post not found');
    res.json(post);
  })
);

// Admin: upload cover image
blogRoutes.post(
  '/admin/cover',
  upload.single('image'),
  asyncHandler(async (req, res) => {
    if (!req.file) throw new ApiError(400, 'No file uploaded (field name must be "image")');
    ensureDir(BLOG_DIR);
    const baseKey = randomKey();
    const processed = await processImage(req.file.buffer, BLOG_DIR, baseKey, {
      maxWidth: 1600,
      thumbWidth: 600,
    });
    res.status(201).json({
      coverUrl: `/uploads/blog/${processed.fullName}`,
      coverThumbUrl: `/uploads/blog/${processed.thumbName}`,
      coverStorageKey: processed.fullName,
      coverThumbStorageKey: processed.thumbName,
      width: processed.width,
      height: processed.height,
    });
  })
);

const postValidators = [
  body('title').isString().trim().isLength({ min: 2, max: 300 }),
  body('body').isString().isLength({ min: 1 }),
  body('slug').optional().isString().isLength({ max: 160 }),
  body('excerpt').optional().isString().isLength({ max: 600 }),
  body('coverUrl').optional().isString().isLength({ max: 500 }),
  body('coverThumbUrl').optional().isString().isLength({ max: 500 }),
  body('coverStorageKey').optional().isString().isLength({ max: 200 }),
  body('coverThumbStorageKey').optional().isString().isLength({ max: 200 }),
  body('category').optional().isString().isLength({ max: 80 }),
  body('status').optional().isIn(['published', 'draft']),
  body('publishedAt').optional().isISO8601(),
];

blogRoutes.post(
  '/',
  postValidators,
  validate,
  asyncHandler(async (req, res) => {
    const payload = { ...req.body };
    payload.slug = await uniqueSlug(BlogPost, payload.slug || payload.title);
    const created = await BlogPost.create(payload);
    res.status(201).json(created);
  })
);

blogRoutes.patch(
  '/:id',
  [param('id').isMongoId(), ...postValidators.map((v) => v.optional())],
  validate,
  asyncHandler(async (req, res) => {
    const existing = await BlogPost.findById(req.params.id);
    if (!existing) throw new ApiError(404, 'Post not found');

    const patch = { ...req.body };
    if (patch.slug && patch.slug !== existing.slug) {
      patch.slug = await uniqueSlug(BlogPost, patch.slug, existing._id);
    } else if (patch.title && !patch.slug && slugify(patch.title) !== existing.slug) {
      // Keep slug stable on title change unless explicitly changed
      delete patch.slug;
    }

    // If a new cover is supplied, delete old cover files
    if (patch.coverStorageKey && patch.coverStorageKey !== existing.coverStorageKey) {
      await safeUnlinkInBlog(existing.coverStorageKey);
      await safeUnlinkInBlog(existing.coverThumbStorageKey);
    }

    Object.assign(existing, patch);
    await existing.save();
    res.json(existing);
  })
);

blogRoutes.delete(
  '/:id',
  [param('id').isMongoId()],
  validate,
  asyncHandler(async (req, res) => {
    const post = await BlogPost.findByIdAndDelete(req.params.id);
    if (!post) throw new ApiError(404, 'Post not found');
    await safeUnlinkInBlog(post.coverStorageKey);
    await safeUnlinkInBlog(post.coverThumbStorageKey);
    res.json({ ok: true, id: post._id });
  })
);

async function safeUnlinkInBlog(storageKey) {
  if (!storageKey) return;
  try {
    await fs.unlink(path.join(BLOG_DIR, storageKey));
  } catch (err) {
    if (err.code !== 'ENOENT') console.error('[blog] unlink failed', storageKey, err.message);
  }
}
