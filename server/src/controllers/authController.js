import { AdminUser } from '../models/AdminUser.js';
import { ApiError, asyncHandler } from '../middleware/error.js';
import { signToken } from '../utils/jwt.js';

export const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  const user = await AdminUser.findOne({ email: String(email).toLowerCase() }).select(
    '+passwordHash'
  );
  if (!user || !user.isActive) throw new ApiError(401, 'Invalid credentials');
  const ok = await user.verifyPassword(password);
  if (!ok) throw new ApiError(401, 'Invalid credentials');

  user.lastLoginAt = new Date();
  await user.save();

  const token = signToken({ sub: user._id.toString(), role: user.role, email: user.email });
  res.json({
    token,
    user: { id: user._id, name: user.name, email: user.email, role: user.role },
  });
});

export const me = asyncHandler(async (req, res) => {
  const user = await AdminUser.findById(req.user.sub);
  if (!user) throw new ApiError(404, 'User not found');
  res.json({ id: user._id, name: user.name, email: user.email, role: user.role });
});
