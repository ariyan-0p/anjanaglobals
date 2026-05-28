import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'
import { api, clearToken, getToken, setToken } from '../lib/api'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [status, setStatus] = useState('idle') // idle | loading | authenticated | unauthenticated

  const refresh = useCallback(async () => {
    if (!getToken()) {
      setUser(null)
      setStatus('unauthenticated')
      return null
    }
    setStatus('loading')
    try {
      const me = await api.get('/auth/me', { auth: true })
      setUser(me)
      setStatus('authenticated')
      return me
    } catch {
      clearToken()
      setUser(null)
      setStatus('unauthenticated')
      return null
    }
  }, [])

  const login = useCallback(
    async (email, password) => {
      const { token } = await api.post('/auth/login', { email, password })
      setToken(token)
      const me = await refresh()
      return me
    },
    [refresh]
  )

  const logout = useCallback(() => {
    clearToken()
    setUser(null)
    setStatus('unauthenticated')
  }, [])

  useEffect(() => {
    refresh()
  }, [refresh])

  const value = useMemo(() => ({ user, status, login, logout, refresh }), [user, status, login, logout, refresh])
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}
