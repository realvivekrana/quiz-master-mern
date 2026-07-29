import { useState } from 'react'
import {
  Link,
  useNavigate
} from 'react-router-dom'

import { useAuth } from '../context/AuthContext'

export default function Register() {
  const { register } = useAuth()
  const navigate = useNavigate()

  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  })

  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const [showPassword, setShowPassword] =
    useState(false)

  const [showConfirmPassword, setShowConfirmPassword] =
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
  // REGISTER
  // ==========================================

  async function handleSubmit(event) {
    event.preventDefault()

    const name = form.name.trim()
    const email = form.email.trim()
    const password = form.password
    const confirmPassword = form.confirmPassword

    // ========================================
    // BASIC VALIDATION
    // ========================================

    if (!name) {
      setError('Name is required.')
      return
    }

    if (name.length < 2) {
      setError(
        'Name must contain at least 2 characters.'
      )
      return
    }

    if (!email) {
      setError('Email is required.')
      return
    }

    if (!password) {
      setError('Password is required.')
      return
    }

    if (password.length < 6) {
      setError(
        'Password must contain at least 6 characters.'
      )
      return
    }

    if (!confirmPassword) {
      setError(
        'Please confirm your password.'
      )
      return
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match.')
      return
    }

    // ========================================
    // API REGISTER
    // ========================================

    try {
      setLoading(true)
      setError('')

      const registeredUser = await register(
        name,
        email,
        password
      )

      if (registeredUser?.role === 'admin') {
        navigate('/admin', {
          replace: true
        })

        return
      }

      navigate('/dashboard', {
        replace: true
      })
    } catch (err) {
      console.error(
        'Registration error:',
        err
      )

      setError(
        err.response?.data?.message ||
          'Unable to create your account. Please try again.'
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
                fontFamily:
                  'var(--font-display)',
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
              Join Quiz Master
            </span>

            <h1
              style={{
                fontSize:
                  'clamp(28px, 8vw, 38px)',
                marginBottom: 10
              }}
            >
              Create your account
            </h1>

            <p
              style={{
                margin: 0,
                color: 'var(--muted)',
                lineHeight: 1.7
              }}
            >
              Create an account, play quizzes,
              track your scores and compete on
              the leaderboard.
            </p>
          </div>

          {/* ==================================
              REGISTER CARD
          =================================== */}

          <div className="card">
            <form onSubmit={handleSubmit}>

              {/* ==================================
                  NAME
              =================================== */}

              <div className="field">
                <label htmlFor="register-name">
                  Full name
                </label>

                <input
                  id="register-name"
                  type="text"
                  name="name"
                  className="input"
                  placeholder="Enter your name"
                  value={form.name}
                  onChange={handleChange}
                  autoComplete="name"
                  disabled={loading}
                />
              </div>

              {/* ==================================
                  EMAIL
              =================================== */}

              <div className="field">
                <label htmlFor="register-email">
                  Email address
                </label>

                <input
                  id="register-email"
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

              {/* ==================================
                  PASSWORD
              =================================== */}

              <div className="field">
                <label htmlFor="register-password">
                  Password
                </label>

                <div
                  style={{
                    position: 'relative'
                  }}
                >
                  <input
                    id="register-password"
                    type={
                      showPassword
                        ? 'text'
                        : 'password'
                    }
                    name="password"
                    className="input"
                    placeholder="Minimum 6 characters"
                    value={form.password}
                    onChange={handleChange}
                    autoComplete="new-password"
                    disabled={loading}
                    style={{
                      paddingRight: 74
                    }}
                  />

                  <PasswordButton
                    visible={showPassword}
                    disabled={loading}
                    onClick={() =>
                      setShowPassword(
                        (current) => !current
                      )
                    }
                  />
                </div>

                <p
                  style={{
                    margin:
                      '7px 0 0',
                    color: 'var(--muted)',
                    fontFamily:
                      'var(--font-mono)',
                    fontSize: 10,
                    lineHeight: 1.5
                  }}
                >
                  Use at least 6 characters.
                </p>
              </div>

              {/* ==================================
                  CONFIRM PASSWORD
              =================================== */}

              <div className="field">
                <label htmlFor="confirm-password">
                  Confirm password
                </label>

                <div
                  style={{
                    position: 'relative'
                  }}
                >
                  <input
                    id="confirm-password"
                    type={
                      showConfirmPassword
                        ? 'text'
                        : 'password'
                    }
                    name="confirmPassword"
                    className="input"
                    placeholder="Enter password again"
                    value={
                      form.confirmPassword
                    }
                    onChange={handleChange}
                    autoComplete="new-password"
                    disabled={loading}
                    style={{
                      paddingRight: 74
                    }}
                  />

                  <PasswordButton
                    visible={
                      showConfirmPassword
                    }
                    disabled={loading}
                    onClick={() =>
                      setShowConfirmPassword(
                        (current) => !current
                      )
                    }
                  />
                </div>
              </div>

              {/* ==================================
                  ERROR
              =================================== */}

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

              {/* ==================================
                  SUBMIT
              =================================== */}

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

                    Creating account...
                  </>
                ) : (
                  'Create account'
                )}
              </button>
            </form>

            {/* ==================================
                LOGIN LINK
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
                Already have an account?{' '}

                <Link
                  to="/login"
                  style={{
                    color: 'var(--amber)',
                    fontWeight: 600
                  }}
                >
                  Log in
                </Link>
              </p>
            </div>
          </div>

          {/* ==================================
              FOOTER
          =================================== */}

          <div className="auth-footer">
            <span
              style={{
                fontFamily:
                  'var(--font-mono)',
                fontSize: 11
              }}
            >
              CREATE • PLAY • MASTER
            </span>
          </div>
        </div>
      </div>
    </main>
  )
}

// ==========================================
// PASSWORD SHOW / HIDE BUTTON
// ==========================================

function PasswordButton({
  visible,
  disabled,
  onClick
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      aria-label={
        visible
          ? 'Hide password'
          : 'Show password'
      }
      style={{
        position: 'absolute',
        top: '50%',
        right: 8,
        transform: 'translateY(-50%)',
        minWidth: 54,
        minHeight: 34,
        padding: '5px 8px',
        border:
          '1px solid var(--border)',
        borderRadius: 7,
        background: 'var(--panel)',
        color: 'var(--muted)',
        fontFamily: 'var(--font-mono)',
        fontSize: 10
      }}
    >
      {visible ? 'HIDE' : 'SHOW'}
    </button>
  )
}