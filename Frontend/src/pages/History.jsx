import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'

import api from '../api/axios'

export default function History() {
  const [results, setResults] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  // ==========================================
  // LOAD USER QUIZ HISTORY
  // ==========================================

  useEffect(() => {
    async function fetchHistory() {
      try {
        setLoading(true)
        setError('')

        const { data } = await api.get('/results/me')

        setResults(
          Array.isArray(data)
            ? data
            : data.results || []
        )
      } catch (err) {
        console.error('History error:', err)

        setError(
          err.response?.data?.message ||
            'Could not load quiz history.'
        )
      } finally {
        setLoading(false)
      }
    }

    fetchHistory()
  }, [])

  // ==========================================
  // STATS
  // ==========================================

  const bestScore = useMemo(() => {
    if (results.length === 0) return 0

    return Math.max(
      ...results.map((result) =>
        Number(result.score || 0)
      )
    )
  }, [results])

  const averageScore = useMemo(() => {
    if (results.length === 0) return 0

    const total = results.reduce(
      (sum, result) =>
        sum + Number(result.score || 0),
      0
    )

    return Math.round(total / results.length)
  }, [results])

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
            justifyContent: 'center',
            alignItems: 'center'
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
              Loading quiz history...
            </span>
          </div>
        </div>
      </main>
    )
  }

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

        <div className="history-header">
          <div>
            <span className="eyebrow">
              Your activity
            </span>

            <h1
              style={{
                marginTop: 7,
                marginBottom: 8,
                fontSize:
                  'clamp(30px, 8vw, 42px)'
              }}
            >
              Quiz History
            </h1>

            <p
              style={{
                margin: 0,
                color: 'var(--muted)',
                lineHeight: 1.6
              }}
            >
              Review your previous attempts and
              track your progress.
            </p>
          </div>

          <Link
            to="/dashboard"
            className="btn btn-ghost"
          >
            ← Dashboard
          </Link>
        </div>

        {/* ==================================
            ERROR
        =================================== */}

        {error && (
          <div
            style={{
              marginBottom: 24,
              padding: 14,
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

        <div className="history-stats">
          <HistoryStat
            label="Total Attempts"
            value={results.length}
          />

          <HistoryStat
            label="Best Score"
            value={`${bestScore}%`}
            color="var(--teal)"
          />

          <HistoryStat
            label="Average Score"
            value={`${averageScore}%`}
            color="var(--amber)"
          />
        </div>

        {/* ==================================
            HISTORY
        =================================== */}

        <section>
          <div className="history-section-header">
            <div>
              <span className="eyebrow">
                Attempts
              </span>

              <h2
                style={{
                  marginTop: 5,
                  marginBottom: 0
                }}
              >
                Previous Quizzes
              </h2>
            </div>

            <span className="pill">
              {results.length}{' '}
              {results.length === 1
                ? 'attempt'
                : 'attempts'}
            </span>
          </div>

          {results.length === 0 ? (
            <div
              className="card"
              style={{
                textAlign: 'center',
                paddingBlock: 45
              }}
            >
              <h3>
                No quiz history yet
              </h3>

              <p
                style={{
                  color: 'var(--muted)',
                  marginBottom: 24
                }}
              >
                Complete your first quiz and your
                result will appear here.
              </p>

              <Link
                to="/dashboard"
                className="btn btn-primary"
              >
                Browse Quizzes
              </Link>
            </div>
          ) : (
            <div className="history-list">
              {results.map((result, index) => (
                <HistoryCard
                  key={
                    result._id ||
                    result.id ||
                    index
                  }
                  result={result}
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
// HISTORY CARD
// ==========================================

function HistoryCard({ result }) {
  const quiz =
    result.quiz || result.quizId || {}

  const title =
    typeof quiz === 'object'
      ? quiz.title || 'Quiz'
      : result.quizTitle || 'Quiz'

  const quizId =
    typeof quiz === 'object'
      ? quiz._id || quiz.id
      : quiz

  const score = Number(result.score || 0)

  const correct =
    result.correctCount ?? 0

  const total =
    result.total ??
    result.totalQuestions ??
    0

  return (
    <article className="card history-card">
      <div className="history-card-main">
        <div>
          <span className="eyebrow">
            {formatDate(
              result.createdAt ||
                result.completedAt
            )}
          </span>

          <h3
            style={{
              marginTop: 7,
              marginBottom: 7
            }}
          >
            {title}
          </h3>

          <span
            style={{
              color: 'var(--muted)',
              fontFamily: 'var(--font-mono)',
              fontSize: 11
            }}
          >
            {correct}/{total} correct
          </span>
        </div>

        <div className="history-score">
          <strong>
            {score}%
          </strong>

          <span>
            Score
          </span>
        </div>
      </div>

      {quizId && (
        <div className="history-card-actions">
          <Link
            to={`/quiz/${quizId}`}
            className="btn btn-ghost"
          >
            Play Again
          </Link>

          <Link
            to={`/quiz/${quizId}/leaderboard`}
            className="btn btn-ghost"
          >
            Leaderboard
          </Link>
        </div>
      )}
    </article>
  )
}

// ==========================================
// STAT
// ==========================================

function HistoryStat({
  label,
  value,
  color = 'var(--paper)'
}) {
  return (
    <div className="card">
      <span
        className="eyebrow"
        style={{
          color: 'var(--muted)'
        }}
      >
        {label}
      </span>

      <div
        style={{
          marginTop: 10,
          color,
          fontFamily: 'var(--font-display)',
          fontSize: 30,
          fontWeight: 700
        }}
      >
        {value}
      </div>
    </div>
  )
}

// ==========================================
// DATE
// ==========================================

function formatDate(value) {
  if (!value) {
    return 'Recent attempt'
  }

  const date = new Date(value)

  if (Number.isNaN(date.getTime())) {
    return 'Recent attempt'
  }

  return date.toLocaleDateString('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric'
  })
}