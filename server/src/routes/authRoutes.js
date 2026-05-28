import { Router } from 'express';
import rateLimit from 'express-rate-limit';
import { body } from 'express-validator';
import { login, me } from '../controllers/authController.js';
import { validate } from '../middleware/validate.js';
import { requireAuth } from '../middleware/auth.js';

export const authRoutes = Router();

const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  standardHeaders: true,
  legacyHeaders: false,
});

authRoutes.post(
  '/login',
  loginLimiter,
  [body('email').isEmail(), body('password').isString().isLength({ min: 6 })],
  validate,
  login
);

authRoutes.get('/me', requireAuth, me);
