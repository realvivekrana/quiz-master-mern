import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'

import api from '../api/axios'
import { useAuth } from '../context/AuthContext'

export default function AdminDashboard() {
  const { user } = useAuth()

  const [quizzes, setQuizzes] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  // ==========================================
  // LOAD QUIZZES
  // ==========================================

  useEffect(() => {
    async function fetchQuizzes() {
      try {
        setLoading(true)
        setError('')

        const { data } = await api.get('/quizzes')

        setQuizzes(
          Array.isArray(data)
            ? data
            : data.quizzes || []
        )
      } catch (err) {
        console.error(
          'Admin dashboard error:',
          err
        )

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
  // STATS
  // ==========================================

  const totalQuestions = useMemo(() => {
    return quizzes.reduce(
      (total, quiz) =>
        total +
        (quiz.questions?.length || 0),
      0
    )
  }, [quizzes])

  const categories = useMemo(() => {
    return new Set(
      quizzes.map(
        (quiz) =>
          quiz.category || 'General'
      )
    ).size
  }, [quizzes])

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
                fontFamily:
                  'var(--font-mono)',
                fontSize: 12
              }}
            >
              Loading admin panel...
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
      <div className="container">

        {/* ==================================
            HEADER
        =================================== */}

        <div className="admin-dashboard-header">
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
              Quiz Management
            </h1>

            <p
              style={{
                margin: 0,
                maxWidth: 620,
                color: 'var(--muted)',
                lineHeight: 1.6
              }}
            >
              Welcome
              {user?.name
                ? `, ${user.name}`
                : ''}.
              {' '}
              Manage your quiz library from
              here.
            </p>
          </div>

          <div className="admin-header-actions">
            <Link
              to="/admin/users"
              className="btn btn-ghost"
            >
              Manage Users
            </Link>

            <Link
              to="/admin/quizzes/create"
              className="btn btn-primary"
            >
              + Create Quiz
            </Link>
          </div>
        </div>

        {/* ==================================
            ERROR
        =================================== */}

        {error && (
          <div
            role="alert"
            style={{
              marginBottom: 24,
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

        <div
          className="admin-stats-grid"
          style={{
            marginBottom: 38
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

        {/* ==================================
            QUIZ MANAGEMENT
        =================================== */}

        <section>
          <div className="admin-section-header">
            <div>
              <span className="eyebrow">
                Content
              </span>

              <h2
                style={{
                  marginTop: 5,
                  marginBottom: 0
                }}
              >
                Manage Quizzes
              </h2>
            </div>

            <span className="pill">
              {quizzes.length}{' '}
              {quizzes.length === 1
                ? 'quiz'
                : 'quizzes'}
            </span>
          </div>

          {/* ==================================
              EMPTY STATE
          =================================== */}

          {quizzes.length === 0 ? (
            <div
              className="card"
              style={{
                paddingBlock: 45,
                textAlign: 'center'
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
                  fontSize: 24,
                  fontWeight: 700
                }}
              >
                +
              </div>

              <h3
                style={{
                  marginBottom: 8
                }}
              >
                No quizzes yet
              </h3>

              <p
                style={{
                  maxWidth: 450,
                  margin: '0 auto 22px',
                  color: 'var(--muted)',
                  lineHeight: 1.6
                }}
              >
                Create your first quiz from
                the admin panel.
              </p>

              <Link
                to="/admin/quizzes/create"
                className="btn btn-primary"
              >
                Create Quiz
              </Link>
            </div>
          ) : (
            <div className="admin-quiz-list">
              {quizzes.map((quiz) => (
                <QuizRow
                  key={quiz._id}
                  quiz={quiz}
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
// QUIZ ROW
// ==========================================

function QuizRow({ quiz }) {
  const difficulty =
    quiz.difficulty || 'Easy'

  const difficultyValue =
    difficulty.toLowerCase()

  const difficultyColor =
    difficultyValue === 'hard'
      ? 'var(--red)'
      : difficultyValue === 'medium'
        ? 'var(--amber)'
        : 'var(--teal)'

  const questionCount =
    quiz.questions?.length || 0

  const duration =
    quiz.durationMinutes || 5

  return (
    <article className="card admin-quiz-row">

      {/* ==================================
          QUIZ INFO
      =================================== */}

      <div className="admin-quiz-info">
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 9,
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
              borderColor:
                difficultyColor
            }}
          >
            {difficulty}
          </span>
        </div>

        <h3
          style={{
            marginBottom: 9,
            overflowWrap: 'anywhere'
          }}
        >
          {quiz.title || 'Untitled Quiz'}
        </h3>

        {quiz.description && (
          <p
            style={{
              margin:
                '0 0 12px',
              maxWidth: 650,
              color: 'var(--muted)',
              fontSize: 13,
              lineHeight: 1.6
            }}
          >
            {quiz.description}
          </p>
        )}

        {/* META */}

        <div className="admin-quiz-meta">
          <span>
            {questionCount}{' '}
            {questionCount === 1
              ? 'question'
              : 'questions'}
          </span>

          <span aria-hidden="true">
            •
          </span>

          <span>
            {duration} min
          </span>
        </div>
      </div>

      {/* ==================================
          ACTIONS
      =================================== */}

      <div className="admin-quiz-actions">
        <Link
          to={`/quiz/${quiz._id}`}
          className="btn btn-ghost"
        >
          View
        </Link>

        <Link
          to={`/admin/quizzes/${quiz._id}/edit`}
          className="btn btn-ghost"
          style={{
            color: 'var(--amber)'
          }}
        >
          Edit
        </Link>

        <button
          type="button"
          className="btn btn-ghost"
          style={{
            color: 'var(--red)'
          }}
          disabled
          title="Delete API will be added later"
        >
          Delete
        </button>
      </div>
    </article>
  )
}

// ==========================================
// ADMIN STAT CARD
// ==========================================

function AdminStatCard({
  label,
  value,
  color = 'var(--paper)'
}) {
  return (
    <div className="card admin-stat-card">
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
          fontWeight: 700,
          fontSize:
            'clamp(24px, 7vw, 31px)',
          overflowWrap: 'anywhere'
        }}
      >
        {value}
      </div>
    </div>
  )
}