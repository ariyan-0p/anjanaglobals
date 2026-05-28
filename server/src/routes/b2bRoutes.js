import { Router } from 'express';
import rateLimit from 'express-rate-limit';
import { body } from 'express-validator';
import { B2BAgent } from '../models/B2BAgent.js';
import { ApiError, asyncHandler } from '../middleware/error.js';
import { validate } from '../middleware/validate.js';
import { requireAuth, requireRole } from '../middleware/auth.js';

export const b2bRoutes = Router();

const registerLimiter = rateLimit({
  windowMs: 60 * 60 * 1000,
  max: 10,
  standardHeaders: true,
  legacyHeaders: false,
});

b2bRoutes.post(
  '/register',
  registerLimiter,
  [
    body('companyName').isString().trim().isLength({ min: 2, max: 200 }),
    body('contactName').isString().trim().isLength({ min: 1, max: 120 }),
    body('email').isEmail(),
    body('phone').isString().trim().isLength({ min: 5, max: 30 }),
  ],
  validate,
  asyncHandler(async (req, res) => {
    const existing = await B2BAgent.findOne({ email: String(req.body.email).toLowerCase() });
    if (existing) throw new ApiError(409, 'A request with this email already exists');
    const agent = await B2BAgent.create(req.body);
    res.status(201).json({ ok: true, id: agent._id });
  })
);

// Admin
b2bRoutes.use(requireAuth, requireRole('admin', 'editor'));

b2bRoutes.get(
  '/',
  asyncHandler(async (req, res) => {
    const { status, page = 1, limit = 50 } = req.query;
    const filter = {};
    if (status) filter.status = status;
    const skip = (Number(page) - 1) * Number(limit);
    const [items, total] = await Promise.all([
      B2BAgent.find(filter).sort({ createdAt: -1 }).skip(skip).limit(Number(limit)),
      B2BAgent.countDocuments(filter),
    ]);
    res.json({ items, total, page: Number(page), limit: Number(limit) });
  })
);

b2bRoutes.patch(
  '/:id',
  asyncHandler(async (req, res) => {
    const doc = await B2BAgent.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!doc) throw new ApiError(404, 'Not found');
    res.json(doc);
  })
);

b2bRoutes.delete(
  '/:id',
  asyncHandler(async (req, res) => {
    const doc = await B2BAgent.findByIdAndDelete(req.params.id);
    if (!doc) throw new ApiError(404, 'Not found');
    res.json({ ok: true });
  })
);
