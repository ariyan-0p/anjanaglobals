import { Subscriber } from '../models/Subscriber.js';
import { ApiError, asyncHandler } from '../middleware/error.js';

export const subscribe = asyncHandler(async (req, res) => {
  const { email, source } = req.body;
  const existing = await Subscriber.findOne({ email: String(email).toLowerCase() });
  if (existing) {
    if (!existing.active) {
      existing.active = true;
      await existing.save();
    }
    return res.status(200).json({ ok: true, alreadySubscribed: true });
  }
  const sub = await Subscriber.create({ email, source });
  res.status(201).json({ ok: true, id: sub._id });
});

export const unsubscribe = asyncHandler(async (req, res) => {
  const { email } = req.body;
  const sub = await Subscriber.findOne({ email: String(email).toLowerCase() });
  if (!sub) throw new ApiError(404, 'Not subscribed');
  sub.active = false;
  await sub.save();
  res.json({ ok: true });
});

export const listSubscribers = asyncHandler(async (req, res) => {
  const { active, page = 1, limit = 50 } = req.query;
  const filter = {};
  if (active !== undefined) filter.active = active === 'true';
  const skip = (Number(page) - 1) * Number(limit);
  const [items, total] = await Promise.all([
    Subscriber.find(filter).sort({ createdAt: -1 }).skip(skip).limit(Number(limit)),
    Subscriber.countDocuments(filter),
  ]);
  res.json({ items, total, page: Number(page), limit: Number(limit) });
});
