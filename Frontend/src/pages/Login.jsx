import { useState } from 'react'
import {
  Link,
  useLocation,
  useNavigate
} from 'react-router-dom'

import { useAuth } from '../context/AuthContext'

export default function Login() {
  const { login } = useAuth()

  const navigate = useNavigate()
  const location = useLocation()

  const [form, setForm] = useState({
    email: '',
    password: ''
  })

  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [showPassword, setShowPassword] =
    useState(false)

  // ==========================================
  // INPUT CHANGE
  // ==========================================

  function handleChange(event) {
    const { name, value } = event.target

    setForm((current) => ({
      ...current,
      [name]: value
    }))

    if (error) {
      setError('')
    }
  }

  // ==========================================
  // LOGIN
  // ==========================================

  async function handleSubmit(event) {
    event.preventDefault()

    const email = form.email.trim()
    const password = form.password

    if (!email) {
      setError('Email is required.')
      return
    }

    if (!password) {
      setError('Password is required.')
      return
    }

    try {
      setLoading(true)
      setError('')

      const loggedInUser = await login(
        email,
        password
      )

      // If user originally tried opening a
      // protected page, send them back there.
      const redirectPath =
        location.state?.from?.pathname

      if (redirectPath) {
        navigate(redirectPath, {
          replace: true
        })

        return
      }

      // Admin -> Admin Dashboard
      if (loggedInUser?.role === 'admin') {
        navigate('/admin', {
          replace: true
        })

        return
      }

      // Normal user -> User Dashboard
      navigate('/dashboard', {
        replace: true
      })
    } catch (err) {
      console.error('Login error:', err)

      setError(
        err.response?.data?.message ||
          'Unable to log in. Please check your email and password.'
      )
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="auth-page">
      <div className="container">
        <div
          className="auth-card"
          style={{
            marginInline: 'auto'
          }}
        >
          {/* ==================================
              HEADER
          =================================== */}

          <div className="auth-header">
            <Link
              to="/"
              aria-label="Quiz Master home"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: 48,
                height: 48,
                marginBottom: 20,
                borderRadius: 12,
                background: 'var(--amber)',
                color: 'var(--ink)',
                fontFamily: 'var(--font-display)',
                fontSize: 22,
                fontWeight: 700,
                boxShadow:
                  '0 4px 0 var(--amber-dim)'
              }}
            >
              Q
            </Link>

            <span
              className="eyebrow"
              style={{
                display: 'block',
                marginBottom: 8
              }}
            >
              Welcome back
            </span>

            <h1
              style={{
                fontSize:
                  'clamp(28px, 8vw, 38px)',
                marginBottom: 10
              }}
            >
              Log in to Quiz Master
            </h1>

            <p
              style={{
                margin: 0,
                color: 'var(--muted)',
                lineHeight: 1.7
              }}
            >
              Continue your quizzes, track your
              scores and climb the leaderboard.
            </p>
          </div>

          {/* ==================================
              LOGIN CARD
          =================================== */}

          <div className="card">
            <form onSubmit={handleSubmit}>
              {/* EMAIL */}

              <div className="field">
                <label htmlFor="login-email">
                  Email address
                </label>

                <input
                  id="login-email"
                  type="email"
                  name="email"
                  className="input"
                  placeholder="you@example.com"
                  value={form.email}
                  onChange={handleChange}
                  autoComplete="email"
                  autoCapitalize="none"
                  spellCheck="false"
                  disabled={loading}
                />
              </div>

              {/* PASSWORD */}

              <div className="field">
                <label htmlFor="login-password">
                  Password
                </label>

                <div
                  style={{
                    position: 'relative'
                  }}
                >
                  <input
                    id="login-password"
                    type={
                      showPassword
                        ? 'text'
                        : 'password'
                    }
                    name="password"
                    className="input"
                    placeholder="Enter your password"
                    value={form.password}
                    onChange={handleChange}
                    autoComplete="current-password"
                    disabled={loading}
                    style={{
                      paddingRight: 74
                    }}
                  />

                  <button
                    type="button"
                    onClick={() =>
                      setShowPassword(
                        (current) => !current
                      )
                    }
                    disabled={loading}
                    aria-label={
                      showPassword
                        ? 'Hide password'
                        : 'Show password'
                    }
                    style={{
                      position: 'absolute',
                      top: '50%',
                      right: 8,
                      transform:
                        'translateY(-50%)',
                      minWidth: 54,
                      minHeight: 34,
                      padding: '5px 8px',
                      border:
                        '1px solid var(--border)',
                      borderRadius: 7,
                      background:
                        'var(--panel)',
                      color: 'var(--muted)',
                      fontFamily:
                        'var(--font-mono)',
                      fontSize: 10
                    }}
                  >
                    {showPassword
                      ? 'HIDE'
                      : 'SHOW'}
                  </button>
                </div>
              </div>

              {/* ERROR */}

              {error && (
                <div
                  role="alert"
                  style={{
                    marginBottom: 18,
                    padding: '11px 13px',
                    border:
                      '1px solid rgba(232, 85, 63, 0.4)',
                    borderRadius: 9,
                    background:
                      'rgba(232, 85, 63, 0.08)'
                  }}
                >
                  <p
                    className="error-text"
                    style={{
                      margin: 0
                    }}
                  >
                    {error}
                  </p>
                </div>
              )}

              {/* SUBMIT */}

              <button
                type="submit"
                className="btn btn-primary"
                disabled={loading}
                style={{
                  width: '100%'
                }}
              >
                {loading ? (
                  <>
                    <span
                      className="loader"
                      style={{
                        width: 18,
                        height: 18,
                        borderWidth: 2,
                        borderTopColor:
                          'var(--ink)',
                        borderRightColor:
                          'rgba(20, 22, 58, 0.25)',
                        borderBottomColor:
                          'rgba(20, 22, 58, 0.25)',
                        borderLeftColor:
                          'rgba(20, 22, 58, 0.25)'
                      }}
                    />

                    Logging in...
                  </>
                ) : (
                  'Log in'
                )}
              </button>
            </form>

            {/* ==================================
                REGISTER LINK
            =================================== */}

            <div
              style={{
                marginTop: 22,
                paddingTop: 20,
                borderTop:
                  '1px solid var(--border)',
                textAlign: 'center'
              }}
            >
              <p
                style={{
                  margin: 0,
                  color: 'var(--muted)',
                  fontSize: 14
                }}
              >
                New to Quiz Master?{' '}
                <Link
                  to="/register"
                  style={{
                    color: 'var(--amber)',
                    fontWeight: 600
                  }}
                >
                  Create an account
                </Link>
              </p>
            </div>
          </div>

          {/* ==================================
              BOTTOM INFO
          =================================== */}

          <div className="auth-footer">
            <span
              style={{
                fontFamily: 'var(--font-mono)',
                fontSize: 11
              }}
            >
              PLAY • LEARN • IMPROVE
            </span>
          </div>
        </div>
      </div>
    </main>
  )
}