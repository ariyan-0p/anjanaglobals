// A deploy replaces every hashed page file. A visitor whose tab (or cached index.html)
// predates it asks for a file that no longer exists; the right response is one reload
// onto the new version, never a blank page.
export const CHUNK_RE = /Failed to fetch dynamically imported module|Importing a module script failed|error loading dynamically imported module|Loading chunk .* failed|Unable to preload CSS/i
const KEY = 'anjna:chunk-reload'

export function reloadOnceForNewVersion() {
  try {
    const last = Number(window.sessionStorage.getItem(KEY) || 0)
    if (Date.now() - last > 15000) {
      window.sessionStorage.setItem(KEY, String(Date.now()))
      window.location.reload()
      return true
    }
  } catch { /* storage blocked: fall through to the message */ }
  return false
}
