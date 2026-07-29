import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import api from '../api/axios'
import { useAuth } from '../context/AuthContext'

export default function AdminUsers() {
  const { user: currentUser } = useAuth()

  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [updatingId, setUpdatingId] = useState(null)

  // ==========================================
  // LOAD USERS
  // ==========================================

  useEffect(() => {
    async function fetchUsers() {
      try {
        setLoading(true)
        setError('')

        const { data } = await api.get('/admin/users')

        setUsers(data.users || [])
      } catch (err) {
        console.error('Load users error:', err)

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
  // UPDATE ROLE
  // ==========================================

  async function handleRoleChange(userId, role) {
    try {
      setUpdatingId(userId)
      setError('')
      setSuccess('')

      const { data } = await api.patch(
        `/admin/users/${userId}/role`,
        { role }
      )

      setUsers((prev) =>
        prev.map((user) =>
          user._id === userId
            ? {
                ...user,
                role: data.user.role
              }
            : user
        )
      )

      setSuccess(
        `${data.user.name}'s role changed to ${data.user.role}.`
      )
    } catch (err) {
      console.error('Role update error:', err)

      setError(
        err.response?.data?.message ||
          'Could not update user role.'
      )
    } finally {
      setUpdatingId(null)
    }
  }

  // ==========================================
  // LOADING
  // ==========================================

  if (loading) {
    return (
      <div
        className="container"
        style={{
          display: 'flex',
          justifyContent: 'center',
          paddingTop: 100
        }}
      >
        <div className="loader" />
      </div>
    )
  }

  return (
    <div
      className="container"
      style={{
        paddingTop: 55,
        paddingBottom: 100
      }}
    >
      {/* HEADER */}

      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'flex-end',
          gap: 20,
          marginBottom: 35
        }}
      >
        <div>
          <span className="eyebrow">
            Admin panel
          </span>

          <h1
            style={{
              fontSize: 38,
              marginTop: 8,
              marginBottom: 8
            }}
          >
            User Management
          </h1>

          <p
            style={{
              color: 'var(--muted)',
              margin: 0
            }}
          >
            View registered users, quiz activity
            and manage roles.
          </p>
        </div>

        <Link
          to="/admin"
          className="btn btn-ghost"
        >
          Back to Admin
        </Link>
      </div>

      {/* ERROR */}

      {error && (
        <div
          className="card"
          style={{
            borderColor: 'var(--red)',
            marginBottom: 20,
            padding: 16
          }}
        >
          <p
            className="error-text"
            style={{ margin: 0 }}
          >
            {error}
          </p>
        </div>
      )}

      {/* SUCCESS */}

      {success && (
        <div
          className="card"
          style={{
            borderColor: 'var(--teal)',
            marginBottom: 20,
            padding: 16
          }}
        >
          <p
            style={{
              margin: 0,
              color: 'var(--teal)',
              fontFamily: 'var(--font-mono)',
              fontSize: 13
            }}
          >
            {success}
          </p>
        </div>
      )}

      {/* TOTAL USERS */}

      <div
        style={{
          marginBottom: 30
        }}
      >
        <div
          className="card"
          style={{
            maxWidth: 250
          }}
        >
          <span
            className="eyebrow"
            style={{
              color: 'var(--muted)'
            }}
          >
            Registered Users
          </span>

          <div
            style={{
              fontFamily: 'var(--font-display)',
              fontSize: 34,
              fontWeight: 700,
              marginTop: 10
            }}
          >
            {users.length}
          </div>
        </div>
      </div>

      {/* USERS */}

      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: 18
        }}
      >
        <div>
          <span className="eyebrow">
            Accounts
          </span>

          <h2
            style={{
              fontSize: 28,
              marginTop: 6
            }}
          >
            All Users
          </h2>
        </div>

        <span className="pill">
          {users.length} users
        </span>
      </div>

      {users.length === 0 ? (
        <div
          className="card"
          style={{
            textAlign: 'center',
            padding: 50
          }}
        >
          <h3>No users found</h3>

          <p
            style={{
              color: 'var(--muted)'
            }}
          >
            Registered users will appear here.
          </p>
        </div>
      ) : (
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: 14
          }}
        >
          {users.map((user) => (
            <UserRow
              key={user._id}
              user={user}
              currentUser={currentUser}
              updating={
                updatingId === user._id
              }
              onRoleChange={
                handleRoleChange
              }
            />
          ))}
        </div>
      )}
    </div>
  )
}

// ==========================================
// USER ROW
// ==========================================

function UserRow({
  user,
  currentUser,
  updating,
  onRoleChange
}) {
  const isCurrentUser =
    currentUser?.id === user._id ||
    currentUser?._id === user._id

  const joinedDate = user.createdAt
    ? new Date(user.createdAt).toLocaleDateString()
    : '—'

  return (
    <div
      className="card"
      style={{
        display: 'grid',
        gridTemplateColumns:
          'minmax(220px, 1fr) auto',
        alignItems: 'center',
        gap: 25
      }}
    >
      {/* USER INFO */}

      <div>
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 10,
            flexWrap: 'wrap',
            marginBottom: 8
          }}
        >
          <h3
            style={{
              fontSize: 19
            }}
          >
            {user.name}
          </h3>

          <span
            className="pill"
            style={{
              color:
                user.role === 'admin'
                  ? 'var(--amber)'
                  : 'var(--teal)'
            }}
          >
            {user.role?.toUpperCase()}
          </span>

          {isCurrentUser && (
            <span className="pill">
              YOU
            </span>
          )}
        </div>

        <p
          style={{
            color: 'var(--muted)',
            margin: '0 0 12px',
            fontSize: 14
          }}
        >
          {user.email}
        </p>

        <div
          style={{
            display: 'flex',
            gap: 20,
            flexWrap: 'wrap',
            fontFamily: 'var(--font-mono)',
            fontSize: 12,
            color: 'var(--muted)'
          }}
        >
          <span>
            Attempts: {user.attempts || 0}
          </span>

          <span>
            Best:{' '}
            {user.bestScore !== null &&
            user.bestScore !== undefined
              ? `${user.bestScore}%`
              : '—'}
          </span>

          <span>
            Joined: {joinedDate}
          </span>
        </div>
      </div>

      {/* ROLE CONTROL */}

      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 10
        }}
      >
        <select
          className="input"
          value={user.role || 'user'}
          disabled={
            updating || isCurrentUser
          }
          onChange={(event) =>
            onRoleChange(
              user._id,
              event.target.value
            )
          }
          style={{
            width: 130
          }}
        >
          <option value="user">
            User
          </option>

          <option value="admin">
            Admin
          </option>
        </select>

        {updating && (
          <span
            style={{
              color: 'var(--muted)',
              fontFamily: 'var(--font-mono)',
              fontSize: 12
            }}
          >
            Saving...
          </span>
        )}
      </div>
    </div>
  )
}