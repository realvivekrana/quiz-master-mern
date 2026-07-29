import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'

import api from '../api/axios'
import { useAuth } from '../context/AuthContext'

export default function Dashboard() {
  const { user } = useAuth()

  const [quizzes, setQuizzes] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const [search, setSearch] = useState('')
  const [category, setCategory] = useState('All')
  const [difficulty, setDifficulty] = useState('All')

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
          'Dashboard quiz load error:',
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
  // CATEGORIES
  // ==========================================

  const categories = useMemo(() => {
    return [
      'All',
      ...new Set(
        quizzes
          .map((quiz) => quiz.category)
          .filter(Boolean)
      )
    ]
  }, [quizzes])

  // ==========================================
  // FILTER QUIZZES
  // ==========================================

  const filteredQuizzes = useMemo(() => {
    const searchValue =
      search.trim().toLowerCase()

    return quizzes.filter((quiz) => {
      const quizTitle =
        quiz.title?.toLowerCase() || ''

      const quizCategory =
        quiz.category?.toLowerCase() ||
        'general'

      const quizDifficulty =
        quiz.difficulty?.toLowerCase() ||
        'easy'

      const matchesSearch =
        !searchValue ||
        quizTitle.includes(searchValue) ||
        quizCategory.includes(searchValue)

      const matchesCategory =
        category === 'All' ||
        quizCategory === category.toLowerCase()

      const matchesDifficulty =
        difficulty === 'All' ||
        quizDifficulty ===
          difficulty.toLowerCase()

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

  // ==========================================
  // LOADING
  // ==========================================

  if (loading) {
    return (
      <main className="page">
        <div
          className="container"
          style={{
            minHeight: 350,
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
              Loading quizzes...
            </span>
          </div>
        </div>
      </main>
    )
  }

  return (
    <main className="page">
      <div className="container">

        {/* ==================================
            PAGE HEADER
        =================================== */}

        <div className="page-header">
          <div className="page-header-content">
            <span className="eyebrow">
              Quiz dashboard
            </span>

            <h1
              style={{
                marginTop: 8,
                marginBottom: 10
              }}
            >
              Welcome
              {user?.name
                ? `, ${user.name}`
                : ''}
            </h1>

            <p
              style={{
                margin: 0,
                maxWidth: 650,
                color: 'var(--muted)'
              }}
            >
              Choose a quiz, test your
              knowledge and improve your score.
            </p>
          </div>

          <div className="page-header-actions">
            <Link
              to="/history"
              className="btn btn-ghost"
            >
              Quiz History
            </Link>

            {user?.role === 'admin' && (
              <Link
                to="/admin"
                className="btn btn-primary"
              >
                Admin Panel
              </Link>
            )}
          </div>
        </div>

        {/* ==================================
            ERROR
        =================================== */}

        {error && (
          <div
            role="alert"
            style={{
              padding: '12px 14px',
              marginBottom: 24,
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
          className="stats-grid"
          style={{
            marginBottom: 35
          }}
        >
          <StatCard
            label="Available Quizzes"
            value={quizzes.length}
          />

          <StatCard
            label="Questions"
            value={totalQuestions}
          />

          <StatCard
            label="Categories"
            value={Math.max(
              categories.length - 1,
              0
            )}
          />

          <StatCard
            label="Your Role"
            value={
              user?.role?.toUpperCase() ||
              'USER'
            }
            color={
              user?.role === 'admin'
                ? 'var(--amber)'
                : 'var(--teal)'
            }
          />
        </div>

        {/* ==================================
            QUIZ SECTION HEADER
        =================================== */}

        <section>
          <div
            style={{
              display: 'flex',
              alignItems: 'flex-end',
              justifyContent:
                'space-between',
              gap: 16,
              flexWrap: 'wrap',
              marginBottom: 20
            }}
          >
            <div>
              <span className="eyebrow">
                Quiz Library
              </span>

              <h2
                style={{
                  marginTop: 6
                }}
              >
                Choose your challenge
              </h2>
            </div>

            <span className="pill">
              {filteredQuizzes.length}{' '}
              {filteredQuizzes.length === 1
                ? 'quiz'
                : 'quizzes'}
            </span>
          </div>

          {/* ==================================
              FILTERS
          =================================== */}

          <div
            className="card"
            style={{
              marginBottom: 24
            }}
          >
            <div className="filters-grid">

              {/* SEARCH */}

              <div>
                <label htmlFor="quiz-search">
                  Search
                </label>

                <input
                  id="quiz-search"
                  type="search"
                  className="input"
                  placeholder="Search quizzes..."
                  value={search}
                  onChange={(event) =>
                    setSearch(
                      event.target.value
                    )
                  }
                />
              </div>

              {/* CATEGORY */}

              <div>
                <label htmlFor="quiz-category">
                  Category
                </label>

                <select
                  id="quiz-category"
                  className="input"
                  value={category}
                  onChange={(event) =>
                    setCategory(
                      event.target.value
                    )
                  }
                >
                  {categories.map(
                    (item) => (
                      <option
                        key={item}
                        value={item}
                      >
                        {item}
                      </option>
                    )
                  )}
                </select>
              </div>

              {/* DIFFICULTY */}

              <div>
                <label htmlFor="quiz-difficulty">
                  Difficulty
                </label>

                <select
                  id="quiz-difficulty"
                  className="input"
                  value={difficulty}
                  onChange={(event) =>
                    setDifficulty(
                      event.target.value
                    )
                  }
                >
                  <option value="All">
                    All
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
            </div>
          </div>

          {/* ==================================
              QUIZZES
          =================================== */}

          {filteredQuizzes.length === 0 ? (
            <div
              className="card"
              style={{
                paddingBlock: 45,
                textAlign: 'center'
              }}
            >
              <div
                style={{
                  width: 50,
                  height: 50,
                  margin: '0 auto 16px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  borderRadius: 12,
                  background:
                    'rgba(245, 166, 35, 0.08)',
                  color: 'var(--amber)',
                  fontFamily:
                    'var(--font-display)',
                  fontWeight: 700,
                  fontSize: 20
                }}
              >
                ?
              </div>

              <h3
                style={{
                  marginBottom: 8
                }}
              >
                No quizzes found
              </h3>

              <p
                style={{
                  maxWidth: 450,
                  margin: '0 auto',
                  color: 'var(--muted)'
                }}
              >
                Try changing the search,
                category or difficulty filter.
              </p>
            </div>
          ) : (
            <div className="quiz-grid">
              {filteredQuizzes.map(
                (quiz) => (
                  <QuizCard
                    key={quiz._id}
                    quiz={quiz}
                  />
                )
              )}
            </div>
          )}
        </section>
      </div>
    </main>
  )
}

// ==========================================
// QUIZ CARD
// ==========================================

function QuizCard({ quiz }) {
  const difficulty =
    quiz.difficulty || 'Easy'

  const difficultyColor =
    difficulty.toLowerCase() === 'hard'
      ? 'var(--red)'
      : difficulty.toLowerCase() ===
          'medium'
        ? 'var(--amber)'
        : 'var(--teal)'

  const questionCount =
    quiz.questions?.length || 0

  const duration =
    quiz.durationMinutes || 5

  return (
    <article
      className="card quiz-card"
      style={{
        display: 'flex',
        flexDirection: 'column'
      }}
    >
      {/* TOP */}

      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: 10,
          flexWrap: 'wrap',
          marginBottom: 18
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

      {/* CONTENT */}

      <div
        style={{
          flex: 1
        }}
      >
        <h3
          style={{
            marginBottom: 10
          }}
        >
          {quiz.title || 'Untitled Quiz'}
        </h3>

        {quiz.description && (
          <p
            style={{
              margin: 0,
              color: 'var(--muted)',
              fontSize: 14
            }}
          >
            {quiz.description}
          </p>
        )}
      </div>

      {/* META */}

      <div
        style={{
          display: 'flex',
          gap: 12,
          flexWrap: 'wrap',
          marginTop: 22,
          paddingTop: 18,
          borderTop:
            '1px solid var(--border)',
          color: 'var(--muted)',
          fontFamily:
            'var(--font-mono)',
          fontSize: 11
        }}
      >
        <span>
          {questionCount}{' '}
          {questionCount === 1
            ? 'question'
            : 'questions'}
        </span>

        <span>•</span>

        <span>
          {duration} min
        </span>
      </div>

      {/* ACTION */}

      <Link
        to={`/quiz/${quiz._id}`}
        className="btn btn-primary"
        style={{
          width: '100%',
          marginTop: 18
        }}
      >
        Start Quiz
      </Link>
    </article>
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
    <div className="card stat-card">
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
            'clamp(24px, 7vw, 30px)',
          fontWeight: 700,
          overflowWrap: 'anywhere'
        }}
      >
        {value}
      </div>
    </div>
  )
}