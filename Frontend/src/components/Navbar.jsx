import { useEffect, useState } from 'react'
import {
  Link,
  useLocation,
  useNavigate
} from 'react-router-dom'

import { useAuth } from '../context/AuthContext'

export default function Navbar() {
  const { user, logout } = useAuth()

  const navigate = useNavigate()
  const location = useLocation()

  const [menuOpen, setMenuOpen] =
    useState(false)

  // Route change hone par mobile menu close
  useEffect(() => {
    setMenuOpen(false)
  }, [location.pathname])

  function handleLogout() {
    setMenuOpen(false)
    logout()
    navigate('/login')
  }

  function toggleMenu() {
    setMenuOpen((current) => !current)
  }

  return (
    <header className="navbar">
      <div className="container navbar-container">
        {/* ==================================
            LOGO
        =================================== */}

        <Link
          to="/"
          className="navbar-brand"
          aria-label="Quiz Master Home"
        >
          <span className="navbar-logo">
            Q
          </span>

          <span className="navbar-title">
            Quiz Master
          </span>
        </Link>

        {/* ==================================
            DESKTOP NAVIGATION
        =================================== */}

        <nav
          className="navbar-desktop"
          aria-label="Main navigation"
        >
          {user ? (
            <>
              <Link
                to="/dashboard"
                className="pill"
              >
                Dashboard
              </Link>

              {user.role === 'admin' && (
                <Link
                  to="/admin"
                  className="pill navbar-admin-link"
                >
                  Admin
                </Link>
              )}

              <UserInfo user={user} />

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

        {/* ==================================
            MOBILE MENU BUTTON
        =================================== */}

        <button
          type="button"
          className="navbar-menu-button"
          onClick={toggleMenu}
          aria-label={
            menuOpen
              ? 'Close navigation menu'
              : 'Open navigation menu'
          }
          aria-expanded={menuOpen}
          aria-controls="mobile-navigation"
        >
          <span
            className={`navbar-menu-line ${
              menuOpen
                ? 'navbar-menu-line-1-open'
                : ''
            }`}
          />

          <span
            className={`navbar-menu-line ${
              menuOpen
                ? 'navbar-menu-line-2-open'
                : ''
            }`}
          />

          <span
            className={`navbar-menu-line ${
              menuOpen
                ? 'navbar-menu-line-3-open'
                : ''
            }`}
          />
        </button>
      </div>

      {/* ==================================
          MOBILE NAVIGATION
      =================================== */}

      <div
        id="mobile-navigation"
        className={`navbar-mobile ${
          menuOpen
            ? 'navbar-mobile-open'
            : ''
        }`}
      >
        <div className="container navbar-mobile-inner">
          {user ? (
            <>
              {/* USER */}

              <div className="navbar-mobile-user">
                <div className="navbar-mobile-avatar">
                  {getInitial(user.name)}
                </div>

                <div className="navbar-mobile-user-info">
                  <strong>
                    {user.name || 'User'}
                  </strong>

                  <span>
                    {user.role || 'user'}
                  </span>
                </div>
              </div>

              {/* LINKS */}

              <nav
                className="navbar-mobile-links"
                aria-label="Mobile navigation"
              >
                <Link
                  to="/"
                  className="navbar-mobile-link"
                >
                  <span>Home</span>
                  <span aria-hidden="true">
                    →
                  </span>
                </Link>

                <Link
                  to="/dashboard"
                  className="navbar-mobile-link"
                >
                  <span>Dashboard</span>
                  <span aria-hidden="true">
                    →
                  </span>
                </Link>

                {user.role === 'admin' && (
                  <>
                    <Link
                      to="/admin"
                      className="navbar-mobile-link navbar-mobile-admin"
                    >
                      <span>
                        Admin Panel
                      </span>

                      <span aria-hidden="true">
                        →
                      </span>
                    </Link>

                    <Link
                      to="/admin/users"
                      className="navbar-mobile-link"
                    >
                      <span>
                        Manage Users
                      </span>

                      <span aria-hidden="true">
                        →
                      </span>
                    </Link>
                  </>
                )}
              </nav>

              {/* LOGOUT */}

              <button
                type="button"
                className="btn btn-ghost navbar-mobile-logout"
                onClick={handleLogout}
              >
                Log out
              </button>
            </>
          ) : (
            <div className="navbar-mobile-guest">
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
            </div>
          )}
        </div>
      </div>
    </header>
  )
}

// ==========================================
// DESKTOP USER INFO
// ==========================================

function UserInfo({ user }) {
  const isAdmin =
    user.role === 'admin'

  return (
    <div className="navbar-user-info">
      <span className="navbar-user-name">
        {user.name || 'User'}
      </span>

      <span
        className="navbar-user-role"
        style={{
          color: isAdmin
            ? 'var(--amber)'
            : 'var(--muted)'
        }}
      >
        {user.role || 'user'}
      </span>
    </div>
  )
}

// ==========================================
// USER INITIAL
// ==========================================

function getInitial(name) {
  if (!name) {
    return 'U'
  }

  return name
    .trim()
    .charAt(0)
    .toUpperCase()
}