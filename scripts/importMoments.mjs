// Bulk-import client photos into the shared "moments" gallery bucket.
//
// Reads every image in ./moments-drop, logs in as admin, and uploads them
// in batches to the live upload endpoint (reuses the server's sharp pipeline
// -> WebP + thumbnail, writes to /uploads, inserts GalleryImage docs). The
// photos then show in /admin/galleries (Client moments), on every destination
// page (Happy travellers) and on /testimonials.
//
// Usage (credentials are read from the environment, never hard-coded):
//   ADMIN_EMAIL=admin@anjnaglobal.com ADMIN_PASSWORD=*** node scripts/importMoments.mjs
//   API_BASE=https://anjnaglobal.com ADMIN_EMAIL=... ADMIN_PASSWORD=... node scripts/importMoments.mjs
//
import { readdir, readFile } from 'node:fs/promises'
import { extname, join, basename } from 'node:path'

const API_BASE = process.env.API_BASE || 'https://anjnaglobal.com'
const EMAIL = process.env.ADMIN_EMAIL
const PASSWORD = process.env.ADMIN_PASSWORD
const DROP_DIR = process.env.DROP_DIR || 'moments-drop'

if (!EMAIL || !PASSWORD) {
  console.error('Set ADMIN_EMAIL and ADMIN_PASSWORD env vars before running.')
  process.exit(1)
}
const BATCH = 15

const MIME = { '.jpg': 'image/jpeg', '.jpeg': 'image/jpeg', '.png': 'image/png', '.webp': 'image/webp', '.gif': 'image/gif' }

async function main() {
  const entries = await readdir(DROP_DIR).catch(() => {
    console.error(`Drop folder "${DROP_DIR}" not found.`)
    process.exit(1)
  })
  const files = entries.filter((f) => MIME[extname(f).toLowerCase()])
  if (!files.length) {
    console.error(`No images in "${DROP_DIR}". Drop .jpg/.png/.webp/.gif files there first.`)
    process.exit(1)
  }
  console.log(`Found ${files.length} image(s) in ${DROP_DIR}. Logging in to ${API_BASE} ...`)

  const loginRes = await fetch(`${API_BASE}/api/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: EMAIL, password: PASSWORD }),
  })
  if (!loginRes.ok) {
    console.error(`Login failed (${loginRes.status}): ${await loginRes.text()}`)
    process.exit(1)
  }
  const { token } = await loginRes.json()
  if (!token) { console.error('No token returned from login.'); process.exit(1) }

  let done = 0
  for (let i = 0; i < files.length; i += BATCH) {
    const batch = files.slice(i, i + BATCH)
    const form = new FormData()
    for (const name of batch) {
      const buf = await readFile(join(DROP_DIR, name))
      const blob = new Blob([buf], { type: MIME[extname(name).toLowerCase()] })
      form.append('images', blob, basename(name))
    }
    const res = await fetch(`${API_BASE}/api/galleries/moments/images`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${token}` },
      body: form,
    })
    if (!res.ok) {
      console.error(`Batch ${i / BATCH + 1} failed (${res.status}): ${await res.text()}`)
      process.exit(1)
    }
    const payload = await res.json()
    done += payload.items?.length || batch.length
    console.log(`Uploaded ${done}/${files.length} ...`)
  }
  console.log(`\nDone. ${done} photo(s) are now in the "Client moments" bucket.`)
  console.log('Check /admin/galleries (Client moments tab), any destination page, and /testimonials.')
}

main().catch((err) => { console.error(err); process.exit(1) })
