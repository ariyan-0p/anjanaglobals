import path from 'node:path';
import fs from 'node:fs';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const serverRoot = path.resolve(__dirname, '../..');

export const UPLOADS_DIR =
  process.env.UPLOADS_DIR ||
  (process.env.NODE_ENV === 'production'
    ? '/var/www/anjanaglobals/uploads'
    : path.join(serverRoot, 'uploads'));

export const GALLERIES_DIR = path.join(UPLOADS_DIR, 'galleries');
export const BLOG_DIR = path.join(UPLOADS_DIR, 'blog');
export const BLOG_IMPORTED_DIR = path.join(BLOG_DIR, 'imported');

export function ensureDir(dir) {
  fs.mkdirSync(dir, { recursive: true });
}

ensureDir(GALLERIES_DIR);
ensureDir(BLOG_DIR);
ensureDir(BLOG_IMPORTED_DIR);
