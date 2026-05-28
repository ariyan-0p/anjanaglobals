// Usage:
//   node src/scripts/importWordPress.js [--limit N] [--dry] [--host HOST] [--ip IP]
// Defaults: --host www.anjnaglobal.com --ip 162.222.226.77
// Connects to MongoDB, fetches all WordPress posts via REST API, downloads
// featured media and all inline <img> URLs from the old host to local /uploads/blog/imported/,
// rewrites HTML to point to local URLs, and upserts BlogPost documents keyed by slug.

import mongoose from 'mongoose';
import crypto from 'node:crypto';
import path from 'node:path';
import fs from 'node:fs/promises';
import https from 'node:https';
import { Buffer } from 'node:buffer';
import { decode as decodeEntities } from 'html-entities';
import { fileURLToPath } from 'node:url';
import { dirname } from 'node:path';

import { env } from '../config/env.js';
import { BlogPost } from '../models/BlogPost.js';
import { BLOG_IMPORTED_DIR, ensureDir } from '../config/paths.js';
import { processImage, randomKey } from '../utils/imageProcessor.js';
import { slugify, uniqueSlug } from '../utils/slug.js';

const args = process.argv.slice(2);
function arg(name, def) {
  const idx = args.indexOf(`--${name}`);
  if (idx === -1) return def;
  const val = args[idx + 1];
  if (val && !val.startsWith('--')) return val;
  return true;
}

const HOST = arg('host', 'www.anjnaglobal.com');
const IP = arg('ip', '162.222.226.77');
const DRY = !!arg('dry', false);
const LIMIT = arg('limit') ? Number(arg('limit')) : 0;
const PER_PAGE = 50;
const WP_BASE = `https://${HOST}/blog/wp-json/wp/v2`;

// Custom HTTPS agent that resolves HOST → IP and accepts the old cert
const agent = new https.Agent({
  rejectUnauthorized: false,
  lookup: (hostname, options, callback) => {
    if (hostname === HOST) {
      return callback(null, IP, 4);
    }
    // Fall through to default DNS for everything else
    import('node:dns').then((dns) => dns.lookup(hostname, options, callback));
  },
});

async function wpFetch(urlPath, params = {}) {
  const qs = new URLSearchParams(params).toString();
  const url = `${WP_BASE}${urlPath}${qs ? `?${qs}` : ''}`;
  const res = await fetch(url, {
    // @ts-ignore - undici accepts dispatcher; node's fetch uses agent via dispatcher
    // We instead fall back to https.request below if needed.
    headers: { Accept: 'application/json' },
    // @ts-ignore
    dispatcher: undefined,
  });
  if (!res.ok) throw new Error(`WP fetch failed: ${res.status} ${url}`);
  return {
    body: await res.json(),
    headers: res.headers,
  };
}

// Node's fetch doesn't accept a custom agent — use https.request for the
// host-pinned requests. Wrap into a Promise.
function rawHttpsGet(url) {
  return new Promise((resolve, reject) => {
    const u = new URL(url);
    const req = https.request(
      {
        method: 'GET',
        host: u.hostname,
        servername: u.hostname,
        port: u.port || 443,
        path: u.pathname + u.search,
        agent,
        headers: { Accept: '*/*', 'User-Agent': 'AnjanaGlobalsImporter/1.0' },
      },
      (res) => {
        const status = res.statusCode || 0;
        if (status >= 300 && status < 400 && res.headers.location) {
          res.resume();
          // Follow redirect
          const next = new URL(res.headers.location, url).toString();
          rawHttpsGet(next).then(resolve, reject);
          return;
        }
        const chunks = [];
        res.on('data', (c) => chunks.push(c));
        res.on('end', () =>
          resolve({
            status,
            headers: res.headers,
            buffer: Buffer.concat(chunks),
          })
        );
      }
    );
    req.on('error', reject);
    req.end();
  });
}

async function wpJson(urlPath, params = {}) {
  const qs = new URLSearchParams(params).toString();
  const url = `${WP_BASE}${urlPath}${qs ? `?${qs}` : ''}`;
  const res = await rawHttpsGet(url);
  if (res.status !== 200) throw new Error(`WP ${res.status} for ${url}`);
  return {
    body: JSON.parse(res.buffer.toString('utf8')),
    headers: res.headers,
  };
}

async function fetchAllCategories() {
  const map = new Map();
  let page = 1;
  // eslint-disable-next-line no-constant-condition
  while (true) {
    const { body, headers } = await wpJson('/categories', {
      per_page: '100',
      page: String(page),
    });
    body.forEach((c) => map.set(c.id, decodeEntities(c.name)));
    const totalPages = Number(headers['x-wp-totalpages'] || '1');
    if (page >= totalPages) break;
    page += 1;
  }
  return map;
}

async function downloadImage(srcUrl) {
  const u = new URL(srcUrl);
  // If image is on our old host, route through the IP-pinned agent (cert may be invalid)
  const isOldHost = u.hostname === HOST || u.hostname === HOST.replace(/^www\./, '');
  const res = isOldHost ? await rawHttpsGet(srcUrl) : await fetchNormal(srcUrl);
  if (res.status !== 200) throw new Error(`download ${res.status}: ${srcUrl}`);
  return res.buffer;
}

async function fetchNormal(url) {
  return new Promise((resolve, reject) => {
    const u = new URL(url);
    const req = https.request(
      {
        method: 'GET',
        host: u.hostname,
        port: u.port || 443,
        path: u.pathname + u.search,
        headers: { Accept: '*/*', 'User-Agent': 'AnjanaGlobalsImporter/1.0' },
      },
      (res) => {
        const status = res.statusCode || 0;
        if (status >= 300 && status < 400 && res.headers.location) {
          res.resume();
          fetchNormal(new URL(res.headers.location, url).toString()).then(resolve, reject);
          return;
        }
        const chunks = [];
        res.on('data', (c) => chunks.push(c));
        res.on('end', () => resolve({ status, buffer: Buffer.concat(chunks) }));
      }
    );
    req.on('error', reject);
    req.end();
  });
}

async function saveImage(buffer, hintExt = 'jpg') {
  ensureDir(BLOG_IMPORTED_DIR);
  const baseKey = randomKey();
  try {
    const processed = await processImage(buffer, BLOG_IMPORTED_DIR, baseKey, {
      maxWidth: 1600,
      thumbWidth: 600,
    });
    return {
      url: `/uploads/blog/imported/${processed.fullName}`,
      thumbUrl: `/uploads/blog/imported/${processed.thumbName}`,
      storageKey: processed.fullName,
      thumbStorageKey: processed.thumbName,
    };
  } catch (err) {
    // Some files (animated gifs, broken jpegs) may fail sharp. Save raw.
    const fileName = `${baseKey}.${hintExt}`;
    await fs.writeFile(path.join(BLOG_IMPORTED_DIR, fileName), buffer);
    return {
      url: `/uploads/blog/imported/${fileName}`,
      thumbUrl: `/uploads/blog/imported/${fileName}`,
      storageKey: fileName,
      thumbStorageKey: fileName,
      _rawFallback: true,
      _err: err.message,
    };
  }
}

function extensionFromUrl(url) {
  const m = String(url).match(/\.([a-zA-Z0-9]{2,5})(?:\?|#|$)/);
  return m ? m[1].toLowerCase() : 'jpg';
}

const urlCache = new Map(); // srcUrl -> { url, ... } | 'failed'

async function processInlineImages(html) {
  // Find all img src and srcset URLs that point to the old host
  const imgRegex = /<img\b[^>]*?\bsrc=["']([^"']+)["'][^>]*>/gi;
  const tasks = [];
  let match;
  const targets = new Set();
  while ((match = imgRegex.exec(html)) !== null) {
    const src = match[1];
    if (src.includes(HOST)) targets.add(src);
  }

  // Sequentially download (small fleet, gentler on old host)
  for (const src of targets) {
    if (urlCache.has(src)) continue;
    try {
      const buf = await downloadImage(src);
      const saved = await saveImage(buf, extensionFromUrl(src));
      urlCache.set(src, saved);
    } catch (err) {
      console.warn('  ! inline image failed:', src, err.message);
      urlCache.set(src, 'failed');
    }
  }

  let out = html;
  for (const [src, saved] of urlCache.entries()) {
    if (saved === 'failed') continue;
    if (!targets.has(src)) continue;
    out = out.split(src).join(saved.url);
  }

  // Also strip srcset that still references old host (browser would prefer those)
  out = out.replace(/srcset=["'][^"']*["']/gi, '');

  return out;
}

async function importPost(post, categories) {
  const title = decodeEntities(post.title?.rendered || 'Untitled').trim();
  const excerpt = decodeEntities(
    (post.excerpt?.rendered || '').replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim()
  ).slice(0, 580);
  const category = post.categories?.[0] ? categories.get(post.categories[0]) || '' : '';

  let body = post.content?.rendered || '';
  body = await processInlineImages(body);

  // Featured media
  let cover = { coverUrl: '', coverThumbUrl: '', coverStorageKey: '', coverThumbStorageKey: '' };
  if (post.featured_media) {
    try {
      const { body: media } = await wpJson(`/media/${post.featured_media}`);
      if (media?.source_url) {
        const buf = await downloadImage(media.source_url);
        const saved = await saveImage(buf, extensionFromUrl(media.source_url));
        cover = {
          coverUrl: saved.url,
          coverThumbUrl: saved.thumbUrl,
          coverStorageKey: saved.storageKey,
          coverThumbStorageKey: saved.thumbStorageKey,
        };
      }
    } catch (err) {
      console.warn('  ! featured image failed:', post.id, err.message);
    }
  }

  // Slug: prefer WP slug, ensure unique
  const baseSlug = slugify(post.slug || title);

  const existing = await BlogPost.findOne({
    $or: [{ sourceId: String(post.id) }, { slug: baseSlug }],
  });

  const slug = existing
    ? existing.slug
    : await uniqueSlug(BlogPost, baseSlug);

  const doc = {
    title,
    slug,
    excerpt,
    body,
    category,
    status: 'published',
    publishedAt: post.date ? new Date(post.date) : new Date(),
    source: 'wp-import',
    sourceId: String(post.id),
    ...cover,
  };

  if (DRY) {
    console.log('DRY:', { title: doc.title, slug: doc.slug, cat: doc.category, cover: !!doc.coverUrl });
    return { action: 'dry', slug };
  }

  if (existing) {
    // Delete old cover files if a new cover came in
    if (cover.coverStorageKey && existing.coverStorageKey && cover.coverStorageKey !== existing.coverStorageKey) {
      try { await fs.unlink(path.join(BLOG_IMPORTED_DIR, existing.coverStorageKey)); } catch {}
      try { await fs.unlink(path.join(BLOG_IMPORTED_DIR, existing.coverThumbStorageKey)); } catch {}
    }
    Object.assign(existing, doc);
    await existing.save();
    return { action: 'updated', slug };
  }
  await BlogPost.create(doc);
  return { action: 'created', slug };
}

async function main() {
  console.log(`[import] connecting to MongoDB…`);
  await mongoose.connect(env.mongoUri);
  console.log(`[import] connected`);

  console.log(`[import] fetching categories…`);
  const categories = await fetchAllCategories();
  console.log(`[import] ${categories.size} categories loaded`);

  console.log(`[import] fetching posts (per_page=${PER_PAGE})…`);
  let page = 1;
  let processed = 0;
  let created = 0;
  let updated = 0;
  let failed = 0;

  // eslint-disable-next-line no-constant-condition
  while (true) {
    const { body: posts, headers } = await wpJson('/posts', {
      per_page: String(PER_PAGE),
      page: String(page),
      _fields: 'id,date,slug,title,excerpt,content,featured_media,categories',
    });
    const totalPages = Number(headers['x-wp-totalpages'] || '1');
    const totalPosts = Number(headers['x-wp-total'] || '0');
    console.log(`[import] page ${page}/${totalPages}, ${posts.length} posts (total ${totalPosts})`);

    for (const post of posts) {
      processed += 1;
      try {
        const { action } = await importPost(post, categories);
        if (action === 'created') created += 1;
        else if (action === 'updated') updated += 1;
        process.stdout.write(`  [${processed}] ${action.padEnd(7)} ${post.slug}\n`);
      } catch (err) {
        failed += 1;
        console.warn(`  [${processed}] FAILED  ${post.slug || post.id}: ${err.message}`);
      }
      if (LIMIT && processed >= LIMIT) break;
    }

    if (LIMIT && processed >= LIMIT) break;
    if (page >= totalPages) break;
    page += 1;
  }

  console.log(`[import] done. processed=${processed} created=${created} updated=${updated} failed=${failed}`);
  await mongoose.disconnect();
}

main().catch((err) => {
  console.error('[import] fatal:', err);
  process.exit(1);
});
