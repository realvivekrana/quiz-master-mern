import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import api from '../api/axios'
import { useAuth } from '../context/AuthContext'

export default function AdminDashboard() {
  const { user } = useAuth()

  const [quizzes, setQuizzes] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [deletingId, setDeletingId] = useState(null)

  // ==========================================
  // LOAD QUIZZES
  // ==========================================

  useEffect(() => {
    async function fetchQuizzes() {
      try {
        setLoading(true)
        setError('')

        const { data } = await api.get('/quizzes')

        setQuizzes(data.quizzes || [])
      } catch (err) {
        console.error('Admin dashboard error:', err)

        setError(
          err.response?.data?.message ||
            'Could not load quizzes.'
        )
      } finally {
        setLoading(false)
      }
    }

    fetchQuizzes()
  }, [])

  // ==========================================
  // DELETE QUIZ
  // ==========================================

  async function handleDelete(quiz) {
    const confirmed = window.confirm(
      `Are you sure you want to delete "${quiz.title}"?\n\nThis will also delete its leaderboard results.`
    )

    if (!confirmed) {
      return
    }

    try {
      setDeletingId(quiz._id)
      setError('')
      setSuccess('')

      await api.delete(`/quizzes/${quiz._id}`)

      // Remove deleted quiz from UI
      setQuizzes((prev) =>
        prev.filter(
          (item) => item._id !== quiz._id
        )
      )

      setSuccess(
        `"${quiz.title}" deleted successfully.`
      )
    } catch (err) {
      console.error('Delete quiz error:', err)

      setError(
        err.response?.data?.message ||
          'Could not delete quiz.'
      )
    } finally {
      setDeletingId(null)
    }
  }

  // ==========================================
  // STATS
  // ==========================================

  const totalQuestions = useMemo(() => {
    return quizzes.reduce(
      (total, quiz) =>
        total + (quiz.questions?.length || 0),
      0
    )
  }, [quizzes])

  const categories = useMemo(() => {
    return new Set(
      quizzes.map(
        (quiz) => quiz.category || 'General'
      )
    ).size
  }, [quizzes])

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
      {/* ======================================
          HEADER
      ======================================= */}

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
            Quiz Management
          </h1>

          <p
            style={{
              color: 'var(--muted)',
              margin: 0
            }}
          >
            Welcome {user?.name}. Manage your quiz
            library from here.
          </p>
        </div>

        <Link
          to="/admin/quizzes/create"
          className="btn btn-primary"
        >
          + Create Quiz
        </Link>
      </div>

      {/* ======================================
          MESSAGES
      ======================================= */}

      {error && (
        <div
          className="card"
          style={{
            borderColor: 'var(--red)',
            padding: 16,
            marginBottom: 22
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

      {success && (
        <div
          className="card"
          style={{
            borderColor: 'var(--teal)',
            padding: 16,
            marginBottom: 22
          }}
        >
          <p
            style={{
              color: 'var(--teal)',
              fontFamily: 'var(--font-mono)',
              fontSize: 13,
              margin: 0
            }}
          >
            {success}
          </p>
        </div>
      )}

      {/* ======================================
          STATS
      ======================================= */}

      <div
        style={{
          display: 'grid',
          gridTemplateColumns:
            'repeat(auto-fit, minmax(180px, 1fr))',
          gap: 16,
          marginBottom: 45
        }}
      >
        <AdminStatCard
          label="Total Quizzes"
          value={quizzes.length}
        />

        <AdminStatCard
          label="Total Questions"
          value={totalQuestions}
        />

        <AdminStatCard
          label="Categories"
          value={categories}
        />

        <AdminStatCard
          label="Your Role"
          value="ADMIN"
          color="var(--amber)"
        />
      </div>

      {/* ======================================
          QUIZ MANAGEMENT
      ======================================= */}

      <section>
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: 20
          }}
        >
          <div>
            <span className="eyebrow">
              Content
            </span>

            <h2
              style={{
                fontSize: 28,
                marginTop: 6
              }}
            >
              Manage Quizzes
            </h2>
          </div>

          <span className="pill">
            {quizzes.length} quizzes
          </span>
        </div>

        {/* ==================================
            EMPTY STATE
        =================================== */}

        {quizzes.length === 0 ? (
          <div
            className="card"
            style={{
              textAlign: 'center',
              padding: 50
            }}
          >
            <h3>
              No quizzes yet
            </h3>

            <p
              style={{
                color: 'var(--muted)',
                marginBottom: 25
              }}
            >
              Create your first quiz from the admin
              panel.
            </p>

            <Link
              to="/admin/quizzes/create"
              className="btn btn-primary"
            >
              Create Quiz
            </Link>
          </div>
        ) : (
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: 14
            }}
          >
            {quizzes.map((quiz) => (
              <QuizRow
                key={quiz._id}
                quiz={quiz}
                onDelete={handleDelete}
                deleting={
                  deletingId === quiz._id
                }
              />
            ))}
          </div>
        )}
      </section>
    </div>
  )
}

// ==========================================
// QUIZ ROW
// ==========================================

function QuizRow({
  quiz,
  onDelete,
  deleting
}) {
  const difficulty =
    quiz.difficulty || 'Easy'

  const difficultyColor =
    difficulty === 'Hard'
      ? 'var(--red)'
      : difficulty === 'Medium'
        ? 'var(--amber)'
        : 'var(--teal)'

  return (
    <div
      className="card"
      style={{
        display: 'grid',
        gridTemplateColumns:
          'minmax(220px, 1fr) auto',
        gap: 20,
        alignItems: 'center'
      }}
    >
      {/* Quiz Information */}

      <div>
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 10,
            flexWrap: 'wrap',
            marginBottom: 10
          }}
        >
          <span className="eyebrow">
            {quiz.category || 'General'}
          </span>

          <span
            className="pill"
            style={{
              color: difficultyColor,
              borderColor: difficultyColor
            }}
          >
            {difficulty}
          </span>
        </div>

        <h3
          style={{
            fontSize: 20,
            marginBottom: 8
          }}
        >
          {quiz.title}
        </h3>

        <div
          style={{
            display: 'flex',
            gap: 15,
            flexWrap: 'wrap',
            color: 'var(--muted)',
            fontFamily: 'var(--font-mono)',
            fontSize: 12
          }}
        >
          <span>
            {quiz.questions?.length || 0} questions
          </span>

          <span>
            {quiz.durationMinutes || 5} min
          </span>
        </div>
      </div>

      {/* ======================================
          ACTIONS
      ======================================= */}

      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 10
        }}
      >
        {/* View */}

        <Link
          to={`/quiz/${quiz._id}`}
          className="btn btn-ghost"
          style={{
            padding: '9px 14px'
          }}
        >
          View
        </Link>

        {/* Edit */}

        <Link
          to={`/admin/quizzes/${quiz._id}/edit`}
          className="btn btn-ghost"
          style={{
            padding: '9px 14px',
            color: 'var(--amber)'
          }}
        >
          Edit
        </Link>

        {/* Delete */}

        <button
          type="button"
          className="btn btn-ghost"
          onClick={() =>
            onDelete(quiz)
          }
          disabled={deleting}
          style={{
            padding: '9px 14px',
            color: 'var(--red)',
            opacity: deleting ? 0.6 : 1
          }}
        >
          {deleting
            ? 'Deleting...'
            : 'Delete'}
        </button>
      </div>
    </div>
  )
}

// ==========================================
// STAT CARD
// ==========================================

function AdminStatCard({
  label,
  value,
  color = 'var(--paper)'
}) {
  return (
    <div className="card">
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
          fontFamily: 'var(--font-display)',
          fontWeight: 700,
          fontSize: 30,
          color,
          marginTop: 10
        }}
      >
        {value}
      </div>
    </div>
  )
}