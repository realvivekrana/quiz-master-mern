import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'

import api from '../api/axios'
import { useAuth } from '../context/AuthContext'

export default function AdminUsers() {
  const { user: currentUser } = useAuth()

  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  // ==========================================
  // LOAD USERS
  // ==========================================

  useEffect(() => {
    async function fetchUsers() {
      try {
        setLoading(true)
        setError('')

        const { data } = await api.get('/admin/users')

        setUsers(
          Array.isArray(data)
            ? data
            : data.users || []
        )
      } catch (err) {
        console.error(
          'Admin users error:',
          err
        )

        setError(
          err.response?.data?.message ||
            'Could not load users.'
        )
      } finally {
        setLoading(false)
      }
    }

    fetchUsers()
  }, [])

  // ==========================================
  // STATS
  // ==========================================

  const totalAdmins = useMemo(() => {
    return users.filter(
      (user) =>
        user.role?.toLowerCase() === 'admin'
    ).length
  }, [users])

  const totalRegularUsers = useMemo(() => {
    return users.filter(
      (user) =>
        user.role?.toLowerCase() !== 'admin'
    ).length
  }, [users])

  // ==========================================
  // LOADING
  // ==========================================

  if (loading) {
    return (
      <main className="page">
        <div
          className="container"
          style={{
            minHeight: 400,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}
        >
          <div
            style={{
              textAlign: 'center'
            }}
          >
            <div
              className="loader"
              style={{
                margin: '0 auto 14px'
              }}
            />

            <span
              style={{
                color: 'var(--muted)',
                fontFamily: 'var(--font-mono)',
                fontSize: 12
              }}
            >
              Loading users...
            </span>
          </div>
        </div>
      </main>
    )
  }

  // ==========================================
  // PAGE
  // ==========================================

  return (
    <main className="page">
      <div
        className="container"
        style={{
          maxWidth: 1000
        }}
      >
        {/* ==================================
            HEADER
        =================================== */}

        <div className="admin-users-header">
          <div>
            <span className="eyebrow">
              Admin panel
            </span>

            <h1
              style={{
                marginTop: 7,
                marginBottom: 8,
                fontSize:
                  'clamp(28px, 8vw, 40px)'
              }}
            >
              User Management
            </h1>

            <p
              style={{
                margin: 0,
                maxWidth: 600,
                color: 'var(--muted)',
                lineHeight: 1.6
              }}
            >
              View registered users and their
              account roles.
            </p>
          </div>

          <Link
            to="/admin"
            className="btn btn-ghost"
          >
            ← Admin Panel
          </Link>
        </div>

        {/* ==================================
            ERROR
        =================================== */}

        {error && (
          <div
            role="alert"
            style={{
              marginBottom: 22,
              padding: '12px 14px',
              border:
                '1px solid rgba(232, 85, 63, 0.4)',
              borderRadius: 10,
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
            STATS
        =================================== */}

        <div className="admin-users-stats">
          <UserStatCard
            label="Total Users"
            value={users.length}
          />

          <UserStatCard
            label="Admins"
            value={totalAdmins}
            color="var(--amber)"
          />

          <UserStatCard
            label="Regular Users"
            value={totalRegularUsers}
            color="var(--teal)"
          />
        </div>

        {/* ==================================
            USERS SECTION
        =================================== */}

        <section>
          <div className="admin-users-section-header">
            <div>
              <span className="eyebrow">
                Accounts
              </span>

              <h2
                style={{
                  marginTop: 5,
                  marginBottom: 0
                }}
              >
                Registered Users
              </h2>
            </div>

            <span className="pill">
              {users.length}{' '}
              {users.length === 1
                ? 'user'
                : 'users'}
            </span>
          </div>

          {/* EMPTY */}

          {users.length === 0 ? (
            <div
              className="card"
              style={{
                textAlign: 'center',
                paddingBlock: 45
              }}
            >
              <div
                style={{
                  width: 52,
                  height: 52,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '0 auto 16px',
                  borderRadius: 12,
                  background:
                    'rgba(245, 166, 35, 0.08)',
                  color: 'var(--amber)',
                  fontFamily:
                    'var(--font-display)',
                  fontSize: 22,
                  fontWeight: 700
                }}
              >
                U
              </div>

              <h3
                style={{
                  marginBottom: 8
                }}
              >
                No users found
              </h3>

              <p
                style={{
                  margin: 0,
                  color: 'var(--muted)'
                }}
              >
                Registered users will appear
                here.
              </p>
            </div>
          ) : (
            <div className="admin-users-list">
              {/* DESKTOP HEADER */}

              <div className="admin-user-table-header">
                <span>User</span>
                <span>Email</span>
                <span>Role</span>
                <span>Joined</span>
              </div>

              {users.map((user) => (
                <UserRow
                  key={user._id || user.id}
                  user={user}
                  currentUser={currentUser}
                />
              ))}
            </div>
          )}
        </section>
      </div>
    </main>
  )
}

// ==========================================
// USER ROW
// ==========================================

function UserRow({
  user,
  currentUser
}) {
  const role =
    user.role?.toLowerCase() || 'user'

  const isAdmin =
    role === 'admin'

  const userId =
    user._id || user.id

  const currentUserId =
    currentUser?._id ||
    currentUser?.id

  const isCurrentUser =
    userId &&
    currentUserId &&
    String(userId) ===
      String(currentUserId)

  const joinedDate =
    formatDate(user.createdAt)

  return (
    <article
      className={`admin-user-row ${
        isCurrentUser
          ? 'admin-user-row-current'
          : ''
      }`}
    >
      {/* USER */}

      <div className="admin-user-identity">
        <div
          className="admin-user-avatar"
          aria-hidden="true"
        >
          {getInitial(user.name)}
        </div>

        <div className="admin-user-name">
          <strong>
            {user.name || 'User'}
          </strong>

          {isCurrentUser && (
            <span className="pill">
              You
            </span>
          )}
        </div>
      </div>

      {/* EMAIL */}

      <div className="admin-user-field">
        <span className="admin-user-mobile-label">
          Email
        </span>

        <span className="admin-user-email">
          {user.email || '—'}
        </span>
      </div>

      {/* ROLE */}

      <div className="admin-user-field">
        <span className="admin-user-mobile-label">
          Role
        </span>

        <span
          className="pill"
          style={{
            color: isAdmin
              ? 'var(--amber)'
              : 'var(--teal)',

            borderColor: isAdmin
              ? 'var(--amber)'
              : 'var(--teal)'
          }}
        >
          {isAdmin
            ? 'Admin'
            : 'User'}
        </span>
      </div>

      {/* JOINED */}

      <div className="admin-user-field">
        <span className="admin-user-mobile-label">
          Joined
        </span>

        <span className="admin-user-date">
          {joinedDate}
        </span>
      </div>
    </article>
  )
}

// ==========================================
// STAT CARD
// ==========================================

function UserStatCard({
  label,
  value,
  color = 'var(--paper)'
}) {
  return (
    <div className="card admin-users-stat-card">
      <span
        className="eyebrow"
        style={{
          color: 'var(--muted)',
          fontSize: 10
        }}
      >
        {label}
      </span>

      <div
        style={{
          marginTop: 9,
          color,
          fontFamily:
            'var(--font-display)',
          fontSize:
            'clamp(25px, 7vw, 32px)',
          fontWeight: 700
        }}
      >
        {value}
      </div>
    </div>
  )
}

// ==========================================
// INITIAL
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

// ==========================================
// DATE FORMAT
// ==========================================

function formatDate(value) {
  if (!value) {
    return '—'
  }

  const date = new Date(value)

  if (Number.isNaN(date.getTime())) {
    return '—'
  }

  return date.toLocaleDateString(
    'en-IN',
    {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    }
  )
}