const STORAGE_KEY = 'anjana_admin_token'

export const apiBase = (() => {
  if (typeof window === 'undefined') return ''
  return import.meta.env.VITE_API_BASE || ''
})()

export function getToken() {
  try {
    return localStorage.getItem(STORAGE_KEY) || null
  } catch {
    return null
  }
}

export function setToken(token) {
  try {
    if (token) localStorage.setItem(STORAGE_KEY, token)
    else localStorage.removeItem(STORAGE_KEY)
  } catch {
    /* ignore */
  }
}

export function clearToken() {
  setToken(null)
}

class ApiError extends Error {
  constructor(status, message, details) {
    super(message)
    this.status = status
    this.details = details
  }
}

async function parseResponse(res) {
  const ct = res.headers.get('content-type') || ''
  if (ct.includes('application/json')) return res.json()
  return res.text()
}

async function request(path, { method = 'GET', body, headers = {}, auth = false, signal } = {}) {
  const isFormData = typeof FormData !== 'undefined' && body instanceof FormData
  const finalHeaders = { Accept: 'application/json', ...headers }
  if (!isFormData && body !== undefined) finalHeaders['Content-Type'] = 'application/json'
  if (auth) {
    const token = getToken()
    if (token) finalHeaders.Authorization = `Bearer ${token}`
  }

  const url = `${apiBase}/api${path.startsWith('/') ? path : `/${path}`}`
  const res = await fetch(url, {
    method,
    headers: finalHeaders,
    body: isFormData ? body : body !== undefined ? JSON.stringify(body) : undefined,
    signal,
  })

  const payload = await parseResponse(res)
  if (!res.ok) {
    if (res.status === 401 && auth) {
      clearToken()
      if (typeof window !== 'undefined') {
        const onAdmin = window.location.pathname.startsWith('/admin')
        if (onAdmin && !window.location.pathname.endsWith('/login')) {
          window.location.assign('/admin/login')
        }
      }
    }
    const message =
      (payload && typeof payload === 'object' && payload.error) ||
      (typeof payload === 'string' && payload) ||
      `Request failed with status ${res.status}`
    throw new ApiError(res.status, message, payload?.details)
  }
  return payload
}

export const api = {
  get: (p, opts) => request(p, { ...opts, method: 'GET' }),
  post: (p, body, opts) => request(p, { ...opts, method: 'POST', body }),
  patch: (p, body, opts) => request(p, { ...opts, method: 'PATCH', body }),
  put: (p, body, opts) => request(p, { ...opts, method: 'PUT', body }),
  delete: (p, opts) => request(p, { ...opts, method: 'DELETE' }),
  upload: (p, formData, opts) =>
    request(p, { ...opts, method: 'POST', body: formData, auth: true }),
}

export { ApiError }
