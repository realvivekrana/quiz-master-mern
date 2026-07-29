import { useEffect, useMemo, useState } from 'react'
import { Link, useParams } from 'react-router-dom'

import api from '../api/axios'
import { useAuth } from '../context/AuthContext'

export default function Leaderboard() {
  const { id } = useParams()
  const { user } = useAuth()

  const [entries, setEntries] = useState([])
  const [quiz, setQuiz] = useState(null)

  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  // ==========================================
  // LOAD LEADERBOARD
  // ==========================================

  useEffect(() => {
    async function fetchLeaderboard() {
      try {
        setLoading(true)
        setError('')

        const { data } = await api.get(
          `/quizzes/${id}/leaderboard`
        )

        /*
          Supported API shapes:

          {
            quiz: {...},
            leaderboard: [...]
          }

          OR

          {
            quiz: {...},
            entries: [...]
          }

          OR

          [...]
        */

        if (Array.isArray(data)) {
          setEntries(data)
          return
        }

        setQuiz(data.quiz || null)

        setEntries(
          data.leaderboard ||
            data.entries ||
            data.results ||
            []
        )
      } catch (err) {
        console.error(
          'Leaderboard load error:',
          err
        )

        setError(
          err.response?.data?.message ||
            'Could not load the leaderboard.'
        )
      } finally {
        setLoading(false)
      }
    }

    fetchLeaderboard()
  }, [id])

  // ==========================================
  // SORT LEADERBOARD
  // ==========================================

  const leaderboard = useMemo(() => {
    return [...entries].sort((a, b) => {
      const scoreA =
        Number(a.score) || 0

      const scoreB =
        Number(b.score) || 0

      if (scoreB !== scoreA) {
        return scoreB - scoreA
      }

      const timeA =
        Number(a.timeTakenSeconds) ||
        Number.MAX_SAFE_INTEGER

      const timeB =
        Number(b.timeTakenSeconds) ||
        Number.MAX_SAFE_INTEGER

      return timeA - timeB
    })
  }, [entries])

  // ==========================================
  // CURRENT USER POSITION
  // ==========================================

  const currentUserRank = useMemo(() => {
    if (!user) {
      return null
    }

    const index = leaderboard.findIndex(
      (entry) => {
        const entryUserId =
          entry.user?._id ||
          entry.user?.id ||
          entry.userId

        const currentUserId =
          user._id || user.id

        if (
          currentUserId &&
          entryUserId
        ) {
          return (
            String(entryUserId) ===
            String(currentUserId)
          )
        }

        return (
          entry.user?.email &&
          user.email &&
          entry.user.email === user.email
        )
      }
    )

    return index >= 0
      ? index + 1
      : null
  }, [leaderboard, user])

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
              Loading leaderboard...
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
          maxWidth: 900
        }}
      >
        {/* ==================================
            HEADER
        =================================== */}

        <div className="leaderboard-header">
          <div>
            <span className="eyebrow">
              Rankings
            </span>

            <h1
              style={{
                marginTop: 7,
                marginBottom: 8,
                fontSize:
                  'clamp(28px, 8vw, 40px)'
              }}
            >
              Leaderboard
            </h1>

            <p
              style={{
                margin: 0,
                maxWidth: 580,
                color: 'var(--muted)',
                lineHeight: 1.6
              }}
            >
              {quiz?.title
                ? `Top scores for ${quiz.title}.`
                : 'See how players rank based on score and completion time.'}
            </p>
          </div>

          <Link
            to={`/quiz/${id}`}
            className="btn btn-primary"
          >
            Play Quiz
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
            CURRENT USER RANK
        =================================== */}

        {currentUserRank && (
          <div
            className="card"
            style={{
              marginBottom: 22,
              borderColor:
                'rgba(245, 166, 35, 0.45)'
            }}
          >
            <div className="current-rank">
              <div>
                <span className="eyebrow">
                  Your position
                </span>

                <h3
                  style={{
                    marginTop: 5,
                    marginBottom: 0
                  }}
                >
                  {user?.name ||
                    'Your score'}
                </h3>
              </div>

              <div
                style={{
                  color: 'var(--amber)',
                  fontFamily:
                    'var(--font-display)',
                  fontSize: 28,
                  fontWeight: 700
                }}
              >
                #{currentUserRank}
              </div>
            </div>
          </div>
        )}

        {/* ==================================
            TOP 3
        =================================== */}

        {leaderboard.length > 0 && (
          <section
            style={{
              marginBottom: 28
            }}
          >
            <div
              style={{
                marginBottom: 16
              }}
            >
              <span className="eyebrow">
                Top Players
              </span>
            </div>

            <div className="leaderboard-podium">
              {leaderboard
                .slice(0, 3)
                .map((entry, index) => (
                  <PodiumCard
                    key={
                      entry._id ||
                      `${getPlayerName(
                        entry
                      )}-${index}`
                    }
                    entry={entry}
                    rank={index + 1}
                  />
                ))}
            </div>
          </section>
        )}

        {/* ==================================
            FULL RANKING
        =================================== */}

        <section>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent:
                'space-between',
              gap: 14,
              flexWrap: 'wrap',
              marginBottom: 16
            }}
          >
            <div>
              <span className="eyebrow">
                Full Ranking
              </span>

              <h2
                style={{
                  marginTop: 5,
                  marginBottom: 0
                }}
              >
                Player standings
              </h2>
            </div>

            <span className="pill">
              {leaderboard.length}{' '}
              {leaderboard.length === 1
                ? 'player'
                : 'players'}
            </span>
          </div>

          {leaderboard.length === 0 ? (
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
                  justifyContent:
                    'center',
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
                #
              </div>

              <h3
                style={{
                  marginBottom: 8
                }}
              >
                No scores yet
              </h3>

              <p
                style={{
                  maxWidth: 450,
                  margin:
                    '0 auto 22px',
                  color: 'var(--muted)'
                }}
              >
                Complete this quiz and become
                the first player on the
                leaderboard.
              </p>

              <Link
                to={`/quiz/${id}`}
                className="btn btn-primary"
              >
                Play Quiz
              </Link>
            </div>
          ) : (
            <div className="leaderboard-list">
              {leaderboard.map(
                (entry, index) => (
                  <LeaderboardRow
                    key={
                      entry._id ||
                      `${getPlayerName(
                        entry
                      )}-${index}`
                    }
                    entry={entry}
                    rank={index + 1}
                    currentUser={user}
                  />
                )
              )}
            </div>
          )}
        </section>

        {/* ==================================
            BOTTOM ACTION
        =================================== */}

        <div
          style={{
            display: 'flex',
            justifyContent: 'center',
            marginTop: 28
          }}
        >
          <Link
            to="/dashboard"
            className="btn btn-ghost"
          >
            ← Back to Dashboard
          </Link>
        </div>
      </div>
    </main>
  )
}

// ==========================================
// PODIUM CARD
// ==========================================

function PodiumCard({
  entry,
  rank
}) {
  const playerName =
    getPlayerName(entry)

  const score =
    Number(entry.score) || 0

  const time =
    formatTime(
      entry.timeTakenSeconds
    )

  const medal =
    rank === 1
      ? '🥇'
      : rank === 2
        ? '🥈'
        : '🥉'

  return (
    <article
      className={`card podium-card podium-${rank}`}
    >
      <div
        aria-hidden="true"
        style={{
          fontSize: 30,
          marginBottom: 10
        }}
      >
        {medal}
      </div>

      <span className="eyebrow">
        Rank #{rank}
      </span>

      <h3
        style={{
          marginTop: 7,
          marginBottom: 12,
          overflowWrap: 'anywhere'
        }}
      >
        {playerName}
      </h3>

      <div
        style={{
          color: 'var(--amber)',
          fontFamily:
            'var(--font-display)',
          fontSize: 28,
          fontWeight: 700
        }}
      >
        {score}%
      </div>

      <span
        style={{
          display: 'block',
          marginTop: 6,
          color: 'var(--muted)',
          fontFamily:
            'var(--font-mono)',
          fontSize: 10
        }}
      >
        {time}
      </span>
    </article>
  )
}

// ==========================================
// LEADERBOARD ROW
// ==========================================

function LeaderboardRow({
  entry,
  rank,
  currentUser
}) {
  const playerName =
    getPlayerName(entry)

  const score =
    Number(entry.score) || 0

  const time =
    formatTime(
      entry.timeTakenSeconds
    )

  const entryUserId =
    entry.user?._id ||
    entry.user?.id ||
    entry.userId

  const currentUserId =
    currentUser?._id ||
    currentUser?.id

  const sameId =
    currentUserId &&
    entryUserId &&
    String(currentUserId) ===
      String(entryUserId)

  const sameEmail =
    currentUser?.email &&
    entry.user?.email &&
    currentUser.email ===
      entry.user.email

  const isCurrentUser =
    sameId || sameEmail

  return (
    <article
      className={`leaderboard-row ${
        isCurrentUser
          ? 'leaderboard-row-current'
          : ''
      }`}
    >
      {/* RANK */}

      <div className="leaderboard-rank">
        {rank <= 3
          ? rank === 1
            ? '🥇'
            : rank === 2
              ? '🥈'
              : '🥉'
          : `#${rank}`}
      </div>

      {/* PLAYER */}

      <div className="leaderboard-player">
        <strong>
          {playerName}
        </strong>

        {isCurrentUser && (
          <span className="pill">
            You
          </span>
        )}
      </div>

      {/* SCORE */}

      <div className="leaderboard-score">
        <span className="leaderboard-mobile-label">
          Score
        </span>

        <strong>
          {score}%
        </strong>
      </div>

      {/* TIME */}

      <div className="leaderboard-time">
        <span className="leaderboard-mobile-label">
          Time
        </span>

        <span>
          {time}
        </span>
      </div>
    </article>
  )
}

// ==========================================
// PLAYER NAME
// ==========================================

function getPlayerName(entry) {
  return (
    entry.user?.name ||
    entry.userName ||
    entry.name ||
    'Player'
  )
}

// ==========================================
// FORMAT TIME
// ==========================================

function formatTime(value) {
  const totalSeconds =
    Number(value) || 0

  const minutes = Math.floor(
    totalSeconds / 60
  )

  const seconds =
    totalSeconds % 60

  if (minutes > 0) {
    return `${minutes}m ${seconds}s`
  }

  return `${seconds}s`
}