import { useEffect, useState } from 'react'
import { api, apiBase } from '../lib/api'

function toAbsolute(url) {
  if (!url) return ''
  if (url.startsWith('http')) return url
  return `${apiBase}${url}`
}

// Fetch all destination galleries from the API. Returns a map of destinationId -> array of images.
export function useAllGalleries() {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    let alive = true
    api
      .get('/galleries')
      .then((res) => {
        if (!alive) return
        const normalized = {}
        for (const [id, items] of Object.entries(res.destinations || {})) {
          normalized[id] = items.map((i) => ({
            ...i,
            url: toAbsolute(i.url),
            thumbUrl: toAbsolute(i.thumbUrl),
          }))
        }
        setData(normalized)
        setLoading(false)
      })
      .catch((err) => {
        if (!alive) return
        setError(err)
        setLoading(false)
      })
    return () => {
      alive = false
    }
  }, [])

  return { data, loading, error }
}
