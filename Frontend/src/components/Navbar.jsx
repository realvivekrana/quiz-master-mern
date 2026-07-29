import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function Navbar() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  // ==========================================
  // LOGOUT
  // ==========================================

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
          padding: '18px 24px',
          gap: 20
        }}
      >
        {/* ==================================
            LOGO
        =================================== */}

        <Link
          to="/"
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 10,
            flexShrink: 0
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

        {/* ==================================
            NAVIGATION
        =================================== */}

        <nav
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'flex-end',
            gap: 12,
            flexWrap: 'wrap'
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

              {/* History */}

              <Link
                to="/history"
                className="pill"
              >
                History
              </Link>

              {/* ==================================
                  ADMIN ONLY
              =================================== */}

              {user.role === 'admin' && (
                <>
                  {/* Admin Dashboard */}

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

                  {/* User Management */}

                  <Link
                    to="/admin/users"
                    className="pill"
                    style={{
                      color: 'var(--teal)',
                      borderColor: 'var(--teal)'
                    }}
                  >
                    Users
                  </Link>
                </>
              )}

              {/* ==================================
                  USER INFO
              =================================== */}

              <div
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'flex-end',
                  gap: 2,
                  marginLeft: 5
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

              {/* ==================================
                  LOGOUT
              =================================== */}

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
              {/* Login */}

              <Link
                to="/login"
                className="btn btn-ghost"
              >
                Log in
              </Link>

              {/* Register */}

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