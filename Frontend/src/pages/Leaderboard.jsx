import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import api from '../api/axios'

export default function Leaderboard() {
  const { id } = useParams()

  const [quiz, setQuiz] = useState(null)
  const [leaderboard, setLeaderboard] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    async function fetchLeaderboard() {
      try {
        setLoading(true)
        setError('')

        const { data } = await api.get(
          `/quizzes/${id}/leaderboard`
        )

        setQuiz(data.quiz)
        setLeaderboard(data.leaderboard || [])
      } catch (err) {
        console.error('Leaderboard error:', err)

        setError(
          err.response?.data?.message ||
            'Could not load leaderboard.'
        )
      } finally {
        setLoading(false)
      }
    }

    fetchLeaderboard()
  }, [id])

  function formatTime(seconds) {
    if (
      seconds === null ||
      seconds === undefined
    ) {
      return '—'
    }

    const minutes = Math.floor(seconds / 60)
    const remainingSeconds = seconds % 60

    if (minutes === 0) {
      return `${remainingSeconds}s`
    }

    return `${minutes}m ${remainingSeconds}s`
  }

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

  if (error) {
    return (
      <div
        className="container"
        style={{
          maxWidth: 800,
          paddingTop: 80,
          textAlign: 'center'
        }}
      >
        <div className="card">
          <p className="error-text">
            {error}
          </p>

          <Link
            to="/dashboard"
            className="btn btn-primary"
            style={{ marginTop: 20 }}
          >
            Back to dashboard
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div
      className="container"
      style={{
        maxWidth: 850,
        paddingTop: 60,
        paddingBottom: 100
      }}
    >
      {/* Header */}

      <div
        style={{
          textAlign: 'center',
          marginBottom: 35
        }}
      >
        <span className="eyebrow">
          Leaderboard
        </span>

        <h2
          style={{
            fontSize: 36,
            marginTop: 10,
            marginBottom: 8
          }}
        >
          {quiz?.title || 'Quiz Rankings'}
        </h2>

        <p
          style={{
            color: 'var(--muted)',
            margin: 0
          }}
        >
          Top players ranked by score and completion time.
        </p>
      </div>

      {/* No results */}

      {leaderboard.length === 0 ? (
        <div
          className="card"
          style={{
            textAlign: 'center',
            padding: 40
          }}
        >
          <h3 style={{ marginBottom: 10 }}>
            No attempts yet
          </h3>

          <p
            style={{
              color: 'var(--muted)',
              marginBottom: 24
            }}
          >
            Be the first player on this leaderboard.
          </p>

          <Link
            to={`/quiz/${id}`}
            className="btn btn-primary"
          >
            Play quiz
          </Link>
        </div>
      ) : (
        <div
          className="card"
          style={{
            padding: 0,
            overflow: 'hidden'
          }}
        >
          {/* Table header */}

          <div
            style={{
              display: 'grid',
              gridTemplateColumns:
                '70px minmax(160px, 1fr) 100px 100px',
              gap: 12,
              padding: '16px 22px',
              borderBottom:
                '1px solid var(--border)',
              color: 'var(--muted)',
              fontFamily: 'var(--font-mono)',
              fontSize: 11,
              textTransform: 'uppercase',
              letterSpacing: '0.08em'
            }}
          >
            <span>Rank</span>
            <span>Player</span>
            <span>Score</span>
            <span>Time</span>
          </div>

          {/* Players */}

          {leaderboard.map((entry, index) => (
            <div
              key={entry._id}
              style={{
                display: 'grid',
                gridTemplateColumns:
                  '70px minmax(160px, 1fr) 100px 100px',
                gap: 12,
                alignItems: 'center',
                padding: '18px 22px',
                borderBottom:
                  index !== leaderboard.length - 1
                    ? '1px solid var(--border)'
                    : 'none'
              }}
            >
              {/* Rank */}

              <div
                style={{
                  fontFamily: 'var(--font-display)',
                  fontSize: 20,
                  fontWeight: 700,
                  color:
                    index === 0
                      ? 'var(--amber)'
                      : index === 1
                        ? 'var(--paper)'
                        : index === 2
                          ? 'var(--teal)'
                          : 'var(--muted)'
                }}
              >
                #{index + 1}
              </div>

              {/* User */}

              <div>
                <div
                  style={{
                    fontFamily:
                      'var(--font-display)',
                    fontWeight: 600,
                    marginBottom: 4
                  }}
                >
                  {entry.user?.name ||
                    'Unknown Player'}
                </div>

                <div
                  style={{
                    color: 'var(--muted)',
                    fontSize: 12
                  }}
                >
                  {entry.user?.email || ''}
                </div>
              </div>

              {/* Score */}

              <div
                style={{
                  fontFamily: 'var(--font-mono)',
                  fontWeight: 700,
                  color: 'var(--amber)'
                }}
              >
                {entry.score}%
              </div>

              {/* Time */}

              <div
                style={{
                  fontFamily: 'var(--font-mono)',
                  color: 'var(--muted)'
                }}
              >
                {formatTime(
                  entry.timeTakenSeconds
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Buttons */}

      <div
        style={{
          display: 'flex',
          justifyContent: 'center',
          gap: 14,
          marginTop: 28,
          flexWrap: 'wrap'
        }}
      >
        <Link
          to={`/quiz/${id}`}
          className="btn btn-ghost"
        >
          Play again
        </Link>

        <Link
          to="/dashboard"
          className="btn btn-primary"
        >
          Back to dashboard
        </Link>
      </div>
    </div>
  )
}