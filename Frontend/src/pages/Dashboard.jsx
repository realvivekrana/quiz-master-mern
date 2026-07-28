import { useEffect, useMemo, useState } from 'react'
import api from '../api/axios'
import QuizCard from '../components/QuizCard'
import { useAuth } from '../context/AuthContext'

export default function Dashboard() {
  const { user } = useAuth()

  const [quizzes, setQuizzes] = useState([])
  const [results, setResults] = useState([])

  const [stats, setStats] = useState({
    totalAttempts: 0,
    bestScore: 0,
    averageScore: 0,
    totalCorrect: 0,
    totalQuestions: 0
  })

  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  // Filters
  const [search, setSearch] = useState('')
  const [category, setCategory] = useState('All')
  const [difficulty, setDifficulty] = useState('All')

  // ==========================================
  // Load Dashboard
  // ==========================================

  useEffect(() => {
    async function fetchDashboard() {
      try {
        setLoading(true)
        setError('')

        const [quizResponse, resultResponse] =
          await Promise.all([
            api.get('/quizzes'),
            api.get('/results/me')
          ])

        setQuizzes(
          quizResponse.data.quizzes || []
        )

        setResults(
          resultResponse.data.results || []
        )

        setStats(
          resultResponse.data.stats || {
            totalAttempts: 0,
            bestScore: 0,
            averageScore: 0,
            totalCorrect: 0,
            totalQuestions: 0
          }
        )
      } catch (err) {
        console.error('Dashboard error:', err)

        setError(
          err.response?.data?.message ||
            'Could not load dashboard.'
        )
      } finally {
        setLoading(false)
      }
    }

    fetchDashboard()
  }, [])

  // ==========================================
  // Categories
  // ==========================================

  const categories = useMemo(() => {
    const values = quizzes.map(
      (quiz) => quiz.category || 'General'
    )

    return [
      'All',
      ...new Set(values)
    ]
  }, [quizzes])

  // ==========================================
  // Filter Quizzes
  // ==========================================

  const filteredQuizzes = useMemo(() => {
    const searchValue =
      search.trim().toLowerCase()

    return quizzes.filter((quiz) => {
      const quizCategory =
        quiz.category || 'General'

      const quizDifficulty =
        quiz.difficulty || 'Easy'

      const matchesSearch =
        !searchValue ||
        quiz.title
          ?.toLowerCase()
          .includes(searchValue) ||
        quiz.description
          ?.toLowerCase()
          .includes(searchValue) ||
        quizCategory
          .toLowerCase()
          .includes(searchValue)

      const matchesCategory =
        category === 'All' ||
        quizCategory === category

      const matchesDifficulty =
        difficulty === 'All' ||
        quizDifficulty === difficulty

      return (
        matchesSearch &&
        matchesCategory &&
        matchesDifficulty
      )
    })
  }, [
    quizzes,
    search,
    category,
    difficulty
  ])

  // ==========================================
  // Reset Filters
  // ==========================================

  function resetFilters() {
    setSearch('')
    setCategory('All')
    setDifficulty('All')
  }

  const hasActiveFilters =
    search.trim() !== '' ||
    category !== 'All' ||
    difficulty !== 'All'

  // ==========================================
  // Time Formatter
  // ==========================================

  function formatTime(seconds) {
    if (
      seconds === null ||
      seconds === undefined
    ) {
      return '—'
    }

    const minutes = Math.floor(seconds / 60)
    const remainingSeconds =
      seconds % 60

    if (minutes === 0) {
      return `${remainingSeconds}s`
    }

    return `${minutes}m ${remainingSeconds}s`
  }

  // ==========================================
  // Date Formatter
  // ==========================================

  function formatDate(date) {
    if (!date) return ''

    return new Date(date).toLocaleDateString(
      'en-IN',
      {
        day: '2-digit',
        month: 'short',
        year: 'numeric'
      }
    )
  }

  // ==========================================
  // Loading
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
      {/* =====================================
          WELCOME
      ====================================== */}

      <section
        style={{
          marginBottom: 35
        }}
      >
        <span className="eyebrow">
          Hey {user?.name?.split(' ')[0] || 'Player'}
        </span>

        <h1
          style={{
            fontSize: 38,
            marginTop: 10,
            marginBottom: 10
          }}
        >
          Ready for another challenge?
        </h1>

        <p
          style={{
            color: 'var(--muted)',
            margin: 0,
            lineHeight: 1.6
          }}
        >
          Pick a quiz, test your knowledge and improve
          your score.
        </p>
      </section>

      {/* Error */}

      {error && (
        <p
          className="error-text"
          style={{
            marginBottom: 25
          }}
        >
          {error}
        </p>
      )}

      {/* =====================================
          STATS
      ====================================== */}

      <section
        style={{
          display: 'grid',
          gridTemplateColumns:
            'repeat(auto-fit, minmax(180px, 1fr))',
          gap: 16,
          marginBottom: 50
        }}
      >
        <StatCard
          label="Available Quizzes"
          value={quizzes.length}
        />

        <StatCard
          label="Total Attempts"
          value={stats.totalAttempts}
        />

        <StatCard
          label="Best Score"
          value={`${stats.bestScore}%`}
          color="var(--teal)"
        />

        <StatCard
          label="Average Score"
          value={`${stats.averageScore}%`}
          color="var(--amber)"
        />
      </section>

      {/* =====================================
          QUIZ LIBRARY
      ====================================== */}

      <section>
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'end',
            gap: 20,
            marginBottom: 22
          }}
        >
          <div>
            <span className="eyebrow">
              Quiz library
            </span>

            <h2
              style={{
                fontSize: 30,
                marginTop: 7
              }}
            >
              Pick a quiz
            </h2>
          </div>

          <span className="pill">
            {filteredQuizzes.length} of {quizzes.length}
          </span>
        </div>

        {/* ===================================
            SEARCH + FILTERS
        ==================================== */}

        <div
          className="card"
          style={{
            padding: 18,
            marginBottom: 25
          }}
        >
          <div
            style={{
              display: 'grid',
              gridTemplateColumns:
                'minmax(220px, 2fr) minmax(150px, 1fr) minmax(150px, 1fr)',
              gap: 12
            }}
          >
            {/* Search */}

            <input
              className="input"
              type="search"
              placeholder="Search quizzes..."
              value={search}
              onChange={(event) =>
                setSearch(event.target.value)
              }
            />

            {/* Category */}

            <select
              className="input"
              value={category}
              onChange={(event) =>
                setCategory(event.target.value)
              }
            >
              {categories.map((item) => (
                <option
                  key={item}
                  value={item}
                >
                  {item === 'All'
                    ? 'All Categories'
                    : item}
                </option>
              ))}
            </select>

            {/* Difficulty */}

            <select
              className="input"
              value={difficulty}
              onChange={(event) =>
                setDifficulty(event.target.value)
              }
            >
              <option value="All">
                All Difficulties
              </option>

              <option value="Easy">
                Easy
              </option>

              <option value="Medium">
                Medium
              </option>

              <option value="Hard">
                Hard
              </option>
            </select>
          </div>

          {hasActiveFilters && (
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                gap: 15,
                marginTop: 15
              }}
            >
              <span
                style={{
                  color: 'var(--muted)',
                  fontSize: 13
                }}
              >
                Found {filteredQuizzes.length}{' '}
                {filteredQuizzes.length === 1
                  ? 'quiz'
                  : 'quizzes'}
              </span>

              <button
                type="button"
                className="btn btn-ghost"
                style={{
                  padding: '8px 14px',
                  fontSize: 13
                }}
                onClick={resetFilters}
              >
                Clear filters
              </button>
            </div>
          )}
        </div>

        {/* ===================================
            QUIZ CARDS
        ==================================== */}

        {filteredQuizzes.length === 0 ? (
          <div
            className="card"
            style={{
              textAlign: 'center',
              padding: 45
            }}
          >
            <h3
              style={{
                marginBottom: 10
              }}
            >
              No quizzes found
            </h3>

            <p
              style={{
                color: 'var(--muted)',
                marginTop: 0,
                marginBottom: 22
              }}
            >
              Try another search, category or
              difficulty.
            </p>

            {hasActiveFilters && (
              <button
                type="button"
                className="btn btn-primary"
                onClick={resetFilters}
              >
                Clear filters
              </button>
            )}
          </div>
        ) : (
          <div
            style={{
              display: 'grid',
              gridTemplateColumns:
                'repeat(auto-fill, minmax(280px, 1fr))',
              gap: 20
            }}
          >
            {filteredQuizzes.map((quiz) => (
              <QuizCard
                key={quiz._id}
                quiz={quiz}
              />
            ))}
          </div>
        )}
      </section>

      {/* =====================================
          RECENT ATTEMPTS
      ====================================== */}

      <section
        style={{
          marginTop: 55
        }}
      >
        <div
          style={{
            marginBottom: 22
          }}
        >
          <span className="eyebrow">
            Your progress
          </span>

          <h2
            style={{
              fontSize: 30,
              marginTop: 7
            }}
          >
            Recent attempts
          </h2>
        </div>

        {results.length === 0 ? (
          <div
            className="card"
            style={{
              textAlign: 'center',
              padding: 40
            }}
          >
            <h3
              style={{
                marginBottom: 8
              }}
            >
              No attempts yet
            </h3>

            <p
              style={{
                color: 'var(--muted)',
                margin: 0
              }}
            >
              Complete your first quiz and your results
              will appear here.
            </p>
          </div>
        ) : (
          <div
            className="card"
            style={{
              padding: 0,
              overflow: 'hidden'
            }}
          >
            {results
              .slice(0, 5)
              .map((result, index) => (
                <div
                  key={result._id}
                  style={{
                    display: 'grid',
                    gridTemplateColumns:
                      'minmax(180px, 1fr) 90px 90px 120px',
                    gap: 15,
                    alignItems: 'center',
                    padding: '18px 22px',

                    borderBottom:
                      index !==
                      Math.min(results.length, 5) - 1
                        ? '1px solid var(--border)'
                        : 'none'
                  }}
                >
                  {/* Quiz */}

                  <div>
                    <div
                      style={{
                        fontFamily:
                          'var(--font-display)',
                        fontWeight: 600,
                        marginBottom: 5
                      }}
                    >
                      {result.quiz?.title ||
                        'Deleted Quiz'}
                    </div>

                    <div
                      style={{
                        color: 'var(--muted)',
                        fontSize: 12
                      }}
                    >
                      {formatDate(
                        result.createdAt
                      )}
                    </div>
                  </div>

                  {/* Score */}

                  <div>
                    <div
                      style={{
                        fontFamily:
                          'var(--font-mono)',
                        fontWeight: 700,
                        color:
                          result.score >= 60
                            ? 'var(--teal)'
                            : 'var(--red)'
                      }}
                    >
                      {result.score}%
                    </div>

                    <div
                      className="eyebrow"
                      style={{
                        color: 'var(--muted)',
                        fontSize: 9
                      }}
                    >
                      Score
                    </div>
                  </div>

                  {/* Correct */}

                  <div>
                    <div
                      style={{
                        fontFamily:
                          'var(--font-mono)'
                      }}
                    >
                      {result.correctCount}/
                      {result.total}
                    </div>

                    <div
                      className="eyebrow"
                      style={{
                        color: 'var(--muted)',
                        fontSize: 9
                      }}
                    >
                      Correct
                    </div>
                  </div>

                  {/* Time */}

                  <div>
                    <div
                      style={{
                        fontFamily:
                          'var(--font-mono)'
                      }}
                    >
                      {formatTime(
                        result.timeTakenSeconds
                      )}
                    </div>

                    <div
                      className="eyebrow"
                      style={{
                        color: 'var(--muted)',
                        fontSize: 9
                      }}
                    >
                      Time
                    </div>
                  </div>
                </div>
              ))}
          </div>
        )}
      </section>
    </div>
  )
}

// ==========================================
// STAT CARD
// ==========================================

function StatCard({
  label,
  value,
  color = 'var(--paper)'
}) {
  return (
    <div
      className="card"
      style={{
        padding: 20
      }}
    >
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
          fontSize: 32,
          fontWeight: 700,
          color,
          marginTop: 10
        }}
      >
        {value}
      </div>
    </div>
  )
}