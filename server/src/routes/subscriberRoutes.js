import { Router } from 'express';
import { body } from 'express-validator';
import {
  subscribe,
  unsubscribe,
  listSubscribers,
} from '../controllers/subscriberController.js';
import { validate } from '../middleware/validate.js';
import { requireAuth, requireRole } from '../middleware/auth.js';

export const subscriberRoutes = Router();

subscriberRoutes.post(
  '/',
  [body('email').isEmail()],
  validate,
  subscribe
);

subscriberRoutes.post(
  '/unsubscribe',
  [body('email').isEmail()],
  validate,
  unsubscribe
);

subscriberRoutes.get('/', requireAuth, requireRole('admin'), listSubscribers);
