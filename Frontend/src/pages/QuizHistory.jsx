import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import api from '../api/axios'

export default function QuizHistory() {
  const [results, setResults] = useState([])
  const [stats, setStats] = useState({
    totalAttempts: 0,
    bestScore: 0,
    averageScore: 0
  })

  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  // ==========================================
  // LOAD HISTORY
  // ==========================================

  useEffect(() => {
    async function fetchHistory() {
      try {
        setLoading(true)
        setError('')

        const { data } = await api.get('/results/me')

        setResults(data.results || [])

        setStats({
          totalAttempts:
            data.stats?.totalAttempts || 0,

          bestScore:
            data.stats?.bestScore || 0,

          averageScore:
            data.stats?.averageScore || 0
        })
      } catch (err) {
        console.error(
          'Quiz history error:',
          err
        )

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
  // TOTAL CORRECT ANSWERS
  // ==========================================

  const totalCorrect = useMemo(() => {
    return results.reduce(
      (total, result) =>
        total + (result.correctCount || 0),
      0
    )
  }, [results])

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
            Your performance
          </span>

          <h1
            style={{
              fontSize: 38,
              marginTop: 8,
              marginBottom: 8
            }}
          >
            Quiz History
          </h1>

          <p
            style={{
              color: 'var(--muted)',
              margin: 0
            }}
          >
            Review your previous quiz attempts and
            scores.
          </p>
        </div>

        <Link
          to="/dashboard"
          className="btn btn-primary"
        >
          Play Quiz
        </Link>
      </div>

      {/* ERROR */}

      {error && (
        <div
          className="card"
          style={{
            borderColor: 'var(--red)',
            marginBottom: 25
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
        <HistoryStat
          label="Attempts"
          value={stats.totalAttempts}
        />

        <HistoryStat
          label="Best Score"
          value={`${stats.bestScore}%`}
          color="var(--teal)"
        />

        <HistoryStat
          label="Average"
          value={`${stats.averageScore}%`}
          color="var(--amber)"
        />

        <HistoryStat
          label="Correct Answers"
          value={totalCorrect}
        />
      </div>

      {/* ======================================
          ATTEMPTS
      ======================================= */}

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
            Previous rounds
          </span>

          <h2
            style={{
              fontSize: 28,
              marginTop: 6
            }}
          >
            Your Attempts
          </h2>
        </div>

        <span className="pill">
          {results.length} attempts
        </span>
      </div>

      {/* EMPTY HISTORY */}

      {results.length === 0 ? (
        <div
          className="card"
          style={{
            textAlign: 'center',
            padding: '55px 25px'
          }}
        >
          <h3
            style={{
              fontSize: 23,
              marginBottom: 10
            }}
          >
            No attempts yet
          </h3>

          <p
            style={{
              color: 'var(--muted)',
              marginBottom: 25
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
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: 14
          }}
        >
          {results.map((result) => (
            <HistoryRow
              key={result._id}
              result={result}
            />
          ))}
        </div>
      )}
    </div>
  )
}

// ==========================================
// HISTORY ROW
// ==========================================

function HistoryRow({ result }) {
  const quiz = result.quiz

  if (!quiz) {
    return null
  }

  const score = result.score || 0

  const scoreColor =
    score >= 80
      ? 'var(--teal)'
      : score >= 50
        ? 'var(--amber)'
        : 'var(--red)'

  const attemptDate = result.createdAt
    ? new Date(result.createdAt).toLocaleString()
    : '—'

  const formatTime = (seconds) => {
    if (
      seconds === null ||
      seconds === undefined
    ) {
      return '—'
    }

    const minutes = Math.floor(seconds / 60)
    const remainingSeconds = seconds % 60

    return `${minutes}:${String(
      remainingSeconds
    ).padStart(2, '0')}`
  }

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
      {/* QUIZ INFO */}

      <div>
        <div
          style={{
            display: 'flex',
            gap: 10,
            alignItems: 'center',
            flexWrap: 'wrap',
            marginBottom: 10
          }}
        >
          <span className="eyebrow">
            {quiz.category || 'General'}
          </span>

          <span className="pill">
            {quiz.difficulty || 'Easy'}
          </span>
        </div>

        <h3
          style={{
            fontSize: 20,
            marginBottom: 12
          }}
        >
          {quiz.title}
        </h3>

        <div
          style={{
            display: 'flex',
            gap: 18,
            flexWrap: 'wrap',
            color: 'var(--muted)',
            fontFamily: 'var(--font-mono)',
            fontSize: 12
          }}
        >
          <span>
            Correct: {result.correctCount || 0}
          </span>

          <span>
            Wrong: {result.incorrectCount || 0}
          </span>

          <span>
            Total: {result.total || 0}
          </span>

          <span>
            Time: {formatTime(
              result.timeTakenSeconds
            )}
          </span>

          <span>
            {attemptDate}
          </span>
        </div>
      </div>

      {/* SCORE + ACTIONS */}

      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 18
        }}
      >
        <div
          style={{
            textAlign: 'center',
            minWidth: 75
          }}
        >
          <div
            style={{
              fontFamily: 'var(--font-display)',
              fontSize: 28,
              fontWeight: 700,
              color: scoreColor
            }}
          >
            {score}%
          </div>

          <span
            className="eyebrow"
            style={{
              color: 'var(--muted)',
              fontSize: 9
            }}
          >
            Score
          </span>
        </div>

        <div
          style={{
            display: 'flex',
            gap: 8
          }}
        >
          <Link
            to={`/quiz/${quiz._id}`}
            className="btn btn-ghost"
            style={{
              padding: '9px 13px'
            }}
          >
            Play Again
          </Link>

          <Link
            to={`/quiz/${quiz._id}/leaderboard`}
            className="btn btn-ghost"
            style={{
              padding: '9px 13px'
            }}
          >
            Leaderboard
          </Link>
        </div>
      </div>
    </div>
  )
}

// ==========================================
// STAT CARD
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