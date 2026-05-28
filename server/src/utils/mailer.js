import nodemailer from 'nodemailer';
import { env } from '../config/env.js';

let transporter = null;

export function getTransporter() {
  if (transporter) return transporter;
  if (!env.smtp.host) return null;
  transporter = nodemailer.createTransport({
    host: env.smtp.host,
    port: env.smtp.port,
    secure: env.smtp.port === 465,
    auth: env.smtp.user ? { user: env.smtp.user, pass: env.smtp.pass } : undefined,
  });
  return transporter;
}

export async function sendMail({ to, subject, html, text, replyTo }) {
  const t = getTransporter();
  if (!t) {
    console.warn('[mail] SMTP not configured, skipping send:', subject);
    return { skipped: true };
  }
  return t.sendMail({
    from: env.smtp.from,
    to: to || env.smtp.to,
    subject,
    html,
    text,
    replyTo,
  });
}
