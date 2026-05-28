import { useState } from 'react'
import { Navigate, useLocation, useNavigate } from 'react-router-dom'
import { LogIn, Loader2, Eye, EyeOff } from 'lucide-react'
import { useAuth } from '../../context/AuthContext'
import './admin.css'

export default function AdminLogin() {
  const { login, status, user } = useAuth()
  const location = useLocation()
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')
  const [submitting, setSubmitting] = useState(false)

  if (status === 'authenticated' && user) {
    const to = location.state?.from || '/admin'
    return <Navigate to={to} replace />
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')
    setSubmitting(true)
    try {
      await login(email.trim(), password)
      navigate(location.state?.from || '/admin', { replace: true })
    } catch (err) {
      setError(err.message || 'Login failed')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="admin-login">
      <form className="admin-login__card" onSubmit={handleSubmit}>
        <div className="admin-login__brand">
          <div className="admin-login__brand-dot" />
          <div>
            <strong>Anjana Globals</strong>
            <span>Admin console</span>
          </div>
        </div>

        <h1>Sign in</h1>
        <p className="admin-login__sub">Use your admin credentials to continue.</p>

        <label className="admin-field">
          <span>Email</span>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            autoComplete="username"
            autoFocus
            placeholder="you@example.com"
          />
        </label>

        <label className="admin-field">
          <span>Password</span>
          <div className="admin-input-wrap">
            <input
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              autoComplete="current-password"
              placeholder="••••••••"
            />
            <button
              type="button"
              className="admin-input-eye"
              onClick={() => setShowPassword((v) => !v)}
              aria-label={showPassword ? 'Hide password' : 'Show password'}
              tabIndex={-1}
            >
              {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          </div>
        </label>

        {error ? <p className="admin-login__error">{error}</p> : null}

        <button
          type="submit"
          className="admin-btn admin-btn--primary admin-login__submit"
          disabled={submitting}
        >
          {submitting ? <Loader2 size={15} className="spin" /> : <LogIn size={15} />}
          {submitting ? 'Signing in…' : 'Sign in'}
        </button>
      </form>
    </div>
  )
}
