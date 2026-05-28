import { validationResult } from 'express-validator';
import { ApiError } from './error.js';

export const validate = (req, _res, next) => {
  const result = validationResult(req);
  if (result.isEmpty()) return next();
  return next(new ApiError(400, 'Validation failed', result.array()));
};
