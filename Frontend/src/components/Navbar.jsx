import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function Navbar() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  function handleLogout() {
    logout()
    navigate('/login')
  }

  return (
    <header
      style={{
        borderBottom: '1px solid var(--border)'
      }}
    >
      <div
        className="container"
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '18px 24px'
        }}
      >
        {/* Logo */}

        <Link
          to="/"
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 10
          }}
        >
          <span
            style={{
              width: 34,
              height: 34,
              borderRadius: 8,
              background: 'var(--amber)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontFamily: 'var(--font-display)',
              fontWeight: 700,
              color: 'var(--ink)'
            }}
          >
            Q
          </span>

          <span
            style={{
              fontFamily: 'var(--font-display)',
              fontWeight: 600,
              fontSize: 18
            }}
          >
            Quiz Master
          </span>
        </Link>

        {/* Navigation */}

        <nav
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 20
          }}
        >
          {user ? (
            <>
              {/* Dashboard */}

              <Link
                to="/dashboard"
                className="pill"
              >
                Dashboard
              </Link>

              {/* Admin Panel - Only Admin */}

              {user.role === 'admin' && (
                <Link
                  to="/admin"
                  className="pill"
                  style={{
                    color: 'var(--amber)',
                    borderColor: 'var(--amber)'
                  }}
                >
                  Admin
                </Link>
              )}

              {/* User Name */}

              <div
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'flex-end',
                  gap: 2
                }}
              >
                <span
                  style={{
                    fontFamily: 'var(--font-mono)',
                    fontSize: 13,
                    color: 'var(--paper)'
                  }}
                >
                  {user.name}
                </span>

                <span
                  style={{
                    fontFamily: 'var(--font-mono)',
                    fontSize: 10,
                    textTransform: 'uppercase',
                    letterSpacing: '0.08em',
                    color:
                      user.role === 'admin'
                        ? 'var(--amber)'
                        : 'var(--muted)'
                  }}
                >
                  {user.role || 'user'}
                </span>
              </div>

              {/* Logout */}

              <button
                type="button"
                className="btn btn-ghost"
                onClick={handleLogout}
              >
                Log out
              </button>
            </>
          ) : (
            <>
              <Link
                to="/login"
                className="btn btn-ghost"
              >
                Log in
              </Link>

              <Link
                to="/register"
                className="btn btn-primary"
              >
                Sign up
              </Link>
            </>
          )}
        </nav>
      </div>
    </header>
  )
}