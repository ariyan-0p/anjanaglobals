import { Lead } from '../models/Lead.js';
import { ApiError, asyncHandler } from '../middleware/error.js';
import { sendMail } from '../utils/mailer.js';

const SOURCE_LABEL = {
  popup: 'Popup',
  contact: 'Contact form',
  package: 'Package',
  b2b: 'B2B Agent registration',
  destination: 'Destination page rail',
  'destination-rail': 'Destination page rail',
  other: 'Other',
};

function escapeHtml(s) {
  return String(s || '').replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
}

function buildLeadEmail(lead) {
  const sourceName = SOURCE_LABEL[lead.source] || lead.source || 'Unknown';
  const lines = [
    `Name: ${lead.name}`,
    `Email: ${lead.email || '-'}`,
    `Phone: ${lead.phone || '-'}`,
    `Destination: ${lead.destination || '-'}`,
    `Source: ${sourceName}`,
    '',
    'Message:',
    lead.message || '(none)',
    '',
    '---',
    `Submitted: ${new Date(lead.createdAt || Date.now()).toISOString()}`,
    `Referer: ${lead.meta?.referer || '-'}`,
  ];
  const text = lines.join('\n');

  const html = `
<div style="font-family:-apple-system,Segoe UI,Roboto,sans-serif;max-width:560px;margin:0 auto;color:#16243b">
  <div style="background:#0e1a30;color:#fff;padding:18px 22px;border-radius:10px 10px 0 0">
    <p style="margin:0;font-size:11px;letter-spacing:.12em;text-transform:uppercase;color:rgba(255,255,255,.6)">New lead · ${escapeHtml(sourceName)}</p>
    <h2 style="margin:6px 0 0;font-size:20px;font-weight:600">${escapeHtml(lead.name)}</h2>
  </div>
  <table style="width:100%;border-collapse:collapse;background:#fff;border:1px solid #e5e7eb;border-top:none">
    ${lead.email ? `<tr><td style="padding:10px 16px;color:#6b7280;font-size:12px;width:96px">Email</td><td style="padding:10px 16px"><a href="mailto:${escapeHtml(lead.email)}" style="color:#c8102e;text-decoration:none">${escapeHtml(lead.email)}</a></td></tr>` : ''}
    ${lead.phone ? `<tr><td style="padding:10px 16px;color:#6b7280;font-size:12px;border-top:1px solid #f1f5f9">Phone</td><td style="padding:10px 16px;border-top:1px solid #f1f5f9"><a href="tel:${escapeHtml(lead.phone)}" style="color:#c8102e;text-decoration:none">${escapeHtml(lead.phone)}</a></td></tr>` : ''}
    ${lead.destination ? `<tr><td style="padding:10px 16px;color:#6b7280;font-size:12px;border-top:1px solid #f1f5f9">Destination</td><td style="padding:10px 16px;border-top:1px solid #f1f5f9">${escapeHtml(lead.destination)}</td></tr>` : ''}
  </table>
  ${lead.message ? `
  <div style="background:#fff;border:1px solid #e5e7eb;border-top:none;padding:16px 22px">
    <p style="margin:0 0 8px;color:#6b7280;font-size:11px;text-transform:uppercase;letter-spacing:.08em">Message</p>
    <div style="color:#16243b;font-size:14px;line-height:1.6;white-space:pre-wrap">${escapeHtml(lead.message)}</div>
  </div>` : ''}
  <div style="background:#f8fafc;border:1px solid #e5e7eb;border-top:none;border-radius:0 0 10px 10px;padding:12px 22px;color:#94a3b8;font-size:11px">
    Submitted ${new Date(lead.createdAt || Date.now()).toLocaleString()} · ${escapeHtml(lead.meta?.referer || '')}
    <br />Manage at <a href="https://anjnaglobal.com/admin/leads" style="color:#1f3b75">anjnaglobal.com/admin/leads</a>
  </div>
</div>`;

  return { text, html };
}

export const createLead = asyncHandler(async (req, res) => {
  const lead = await Lead.create({
    ...req.body,
    meta: {
      ip: req.ip,
      userAgent: req.headers['user-agent'],
      referer: req.headers.referer,
    },
  });

  // Fire-and-forget notification — no-ops gracefully if SMTP is not configured.
  const sourceName = SOURCE_LABEL[lead.source] || lead.source || 'Unknown';
  const { text, html } = buildLeadEmail(lead);
  sendMail({
    subject: `New lead · ${lead.name} (${sourceName})`,
    text,
    html,
    replyTo: lead.email || undefined,
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
