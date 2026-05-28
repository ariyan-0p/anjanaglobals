import { Router } from 'express';
import { body } from 'express-validator';
import { Testimonial } from '../models/Testimonial.js';
import { crudFactory } from '../controllers/crudFactory.js';
import { asyncHandler } from '../middleware/error.js';
import { validate } from '../middleware/validate.js';
import { requireAuth, requireRole } from '../middleware/auth.js';

const c = crudFactory(Testimonial, {
  publicFilter: { isApproved: true },
  sort: { order: 1, createdAt: -1 },
});

export const testimonialRoutes = Router();

testimonialRoutes.get('/', c.listPublic);

// Public submission - lands as unapproved
testimonialRoutes.post(
  '/submit',
  [
    body('name').isString().trim().isLength({ min: 1, max: 120 }),
    body('message').isString().trim().isLength({ min: 5, max: 2000 }),
    body('rating').optional().isInt({ min: 1, max: 5 }),
  ],
  validate,
  asyncHandler(async (req, res) => {
    const t = await Testimonial.create({ ...req.body, isApproved: false });
    res.status(201).json({ ok: true, id: t._id });
  })
);

// Admin
testimonialRoutes.use(requireAuth, requireRole('admin', 'editor'));
testimonialRoutes.get('/admin/all', c.listAll);
testimonialRoutes.post('/', c.create);
testimonialRoutes.patch('/:id', c.update);
testimonialRoutes.delete('/:id', c.remove);
