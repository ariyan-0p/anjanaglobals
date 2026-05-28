import { Router } from 'express';
import rateLimit from 'express-rate-limit';
import { body } from 'express-validator';
import {
  createLead,
  listLeads,
  getLead,
  updateLead,
  deleteLead,
} from '../controllers/leadController.js';
import { validate } from '../middleware/validate.js';
import { requireAuth, requireRole } from '../middleware/auth.js';

export const leadRoutes = Router();

const createLimiter = rateLimit({
  windowMs: 60 * 60 * 1000,
  max: 20,
  standardHeaders: true,
  legacyHeaders: false,
});

// Public submission
leadRoutes.post(
  '/',
  createLimiter,
  [
    body('name').isString().trim().isLength({ min: 1, max: 120 }),
    body('email').optional({ values: 'falsy' }).isEmail(),
    body('phone').optional({ values: 'falsy' }).isString().trim().isLength({ max: 30 }),
    body('source').optional().isIn(['popup', 'contact', 'package', 'b2b', 'other']),
  ],
  validate,
  createLead
);

// Admin
leadRoutes.use(requireAuth, requireRole('admin', 'editor'));
leadRoutes.get('/', listLeads);
leadRoutes.get('/:id', getLead);
leadRoutes.patch('/:id', updateLead);
leadRoutes.delete('/:id', deleteLead);
