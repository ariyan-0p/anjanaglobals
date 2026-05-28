import { Lead } from '../models/Lead.js';
import { ApiError, asyncHandler } from '../middleware/error.js';
import { sendMail } from '../utils/mailer.js';

export const createLead = asyncHandler(async (req, res) => {
  const lead = await Lead.create({
    ...req.body,
    meta: {
      ip: req.ip,
      userAgent: req.headers['user-agent'],
      referer: req.headers.referer,
    },
  });

  // Fire-and-forget notification
  sendMail({
    subject: `New lead: ${lead.name} (${lead.source})`,
    text: `Name: ${lead.name}\nEmail: ${lead.email || '-'}\nPhone: ${lead.phone || '-'}\nDestination: ${lead.destination || '-'}\nMessage: ${lead.message || '-'}`,
    replyTo: lead.email,
  }).catch((e) => console.error('[mail] lead notify failed:', e.message));

  res.status(201).json({ id: lead._id, ok: true });
});

export const listLeads = asyncHandler(async (req, res) => {
  const { status, source, q, page = 1, limit = 20 } = req.query;
  const filter = {};
  if (status) filter.status = status;
  if (source) filter.source = source;
  if (q) {
    filter.$or = [
      { name: new RegExp(q, 'i') },
      { email: new RegExp(q, 'i') },
      { phone: new RegExp(q, 'i') },
    ];
  }
  const skip = (Number(page) - 1) * Number(limit);
  const [items, total] = await Promise.all([
    Lead.find(filter).sort({ createdAt: -1 }).skip(skip).limit(Number(limit)),
    Lead.countDocuments(filter),
  ]);
  res.json({ items, total, page: Number(page), limit: Number(limit) });
});

export const getLead = asyncHandler(async (req, res) => {
  const lead = await Lead.findById(req.params.id);
  if (!lead) throw new ApiError(404, 'Lead not found');
  res.json(lead);
});

export const updateLead = asyncHandler(async (req, res) => {
  const lead = await Lead.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });
  if (!lead) throw new ApiError(404, 'Lead not found');
  res.json(lead);
});

export const deleteLead = asyncHandler(async (req, res) => {
  const result = await Lead.findByIdAndDelete(req.params.id);
  if (!result) throw new ApiError(404, 'Lead not found');
  res.json({ ok: true });
});
