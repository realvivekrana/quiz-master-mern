import { useCallback, useEffect, useRef, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'

import api from '../api/axios'

export default function QuizPlay() {
  const { id } = useParams()
  const navigate = useNavigate()

  const [quiz, setQuiz] = useState(null)
  const [currentIndex, setCurrentIndex] = useState(0)
  const [answers, setAnswers] = useState({})
  const [timeLeft, setTimeLeft] = useState(0)

  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')

  const startTimeRef = useRef(Date.now())
  const submittedRef = useRef(false)

  // ==========================================
  // LOAD QUIZ
  // ==========================================

  useEffect(() => {
    async function fetchQuiz() {
      try {
        setLoading(true)
        setError('')

        const { data } = await api.get(`/quizzes/${id}`)

        const loadedQuiz = data.quiz || data

        setQuiz(loadedQuiz)

        const durationMinutes =
          Number(loadedQuiz.durationMinutes) || 5

        setTimeLeft(durationMinutes * 60)
        startTimeRef.current = Date.now()
      } catch (err) {
        console.error('Quiz load error:', err)

        setError(
          err.response?.data?.message ||
            'Could not load this quiz.'
        )
      } finally {
        setLoading(false)
      }
    }

    fetchQuiz()
  }, [id])

  // ==========================================
  // SUBMIT QUIZ
  // ==========================================

  const submitQuiz = useCallback(async () => {
    if (!quiz || submitting || submittedRef.current) {
      return
    }

    try {
      submittedRef.current = true
      setSubmitting(true)
      setError('')

      const questions = quiz.questions || []

      /*
        Convert our answers object:

        {
          questionId: optionIndex
        }

        into an array for the API.
      */

      const submittedAnswers = questions.map(
        (question, index) => ({
          questionId: question._id,
          selectedOption:
            answers[question._id] ?? null,
          questionIndex: index
        })
      )

      const elapsedSeconds = Math.max(
        0,
        Math.floor(
          (Date.now() - startTimeRef.current) /
            1000
        )
      )

      const { data } = await api.post(
        `/quizzes/${id}/submit`,
        {
          answers: submittedAnswers,
          timeTakenSeconds: elapsedSeconds
        }
      )

      const result = data.result || data

      navigate(`/result/${id}`, {
        replace: true,
        state: {
          result
        }
      })
    } catch (err) {
      console.error('Quiz submit error:', err)

      submittedRef.current = false

      setError(
        err.response?.data?.message ||
          'Could not submit the quiz. Please try again.'
      )
    } finally {
      setSubmitting(false)
    }
  }, [
    quiz,
    answers,
    id,
    navigate,
    submitting
  ])

  // ==========================================
  // TIMER
  // ==========================================

  useEffect(() => {
    if (!quiz || loading || submittedRef.current) {
      return
    }

    if (timeLeft <= 0) {
      submitQuiz()
      return
    }

    const timer = window.setTimeout(() => {
      setTimeLeft((current) =>
        Math.max(current - 1, 0)
      )
    }, 1000)

    return () => {
      window.clearTimeout(timer)
    }
  }, [
    timeLeft,
    quiz,
    loading,
    submitQuiz
  ])

  // ==========================================
  // SELECT ANSWER
  // ==========================================

  function selectAnswer(questionId, optionIndex) {
    if (submitting) {
      return
    }

    setAnswers((current) => ({
      ...current,
      [questionId]: optionIndex
    }))
  }

  // ==========================================
  // NAVIGATION
  // ==========================================

  function previousQuestion() {
    setCurrentIndex((current) =>
      Math.max(current - 1, 0)
    )

    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    })
  }

  function nextQuestion() {
    const lastIndex =
      (quiz?.questions?.length || 1) - 1

    setCurrentIndex((current) =>
      Math.min(current + 1, lastIndex)
    )

    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    })
  }

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
                margin: '0 auto 15px'
              }}
            />

            <span
              style={{
                color: 'var(--muted)',
                fontFamily: 'var(--font-mono)',
                fontSize: 12
              }}
            >
              Loading quiz...
            </span>
          </div>
        </div>
      </main>
    )
  }

  // ==========================================
  // ERROR / QUIZ NOT FOUND
  // ==========================================

  if (!quiz) {
    return (
      <main className="page">
        <div
          className="container"
          style={{
            maxWidth: 700
          }}
        >
          <div
            className="card"
            style={{
              textAlign: 'center'
            }}
          >
            <h2>
              Quiz unavailable
            </h2>

            <p
              style={{
                color: 'var(--muted)',
                marginBottom: 22
              }}
            >
              {error ||
                'This quiz could not be found.'}
            </p>

            <Link
              to="/dashboard"
              className="btn btn-primary"
            >
              Back to Dashboard
            </Link>
          </div>
        </div>
      </main>
    )
  }

  const questions = quiz.questions || []
  const totalQuestions = questions.length

  // ==========================================
  // EMPTY QUIZ
  // ==========================================

  if (totalQuestions === 0) {
    return (
      <main className="page">
        <div
          className="container"
          style={{
            maxWidth: 700
          }}
        >
          <div
            className="card"
            style={{
              textAlign: 'center'
            }}
          >
            <h2>No questions available</h2>

            <p
              style={{
                color: 'var(--muted)',
                marginBottom: 22
              }}
            >
              This quiz does not contain any
              questions yet.
            </p>

            <Link
              to="/dashboard"
              className="btn btn-primary"
            >
              Back to Dashboard
            </Link>
          </div>
        </div>
      </main>
    )
  }

  const currentQuestion =
    questions[currentIndex]

  const questionId =
    currentQuestion._id ||
    `question-${currentIndex}`

  const selectedOption =
    answers[questionId]

  const answeredCount = questions.reduce(
    (count, question, index) => {
      const key =
        question._id ||
        `question-${index}`

      return answers[key] !== undefined
        ? count + 1
        : count
    },
    0
  )

  const progress =
    ((currentIndex + 1) / totalQuestions) *
    100

  const minutes = Math.floor(
    timeLeft / 60
  )

  const seconds = timeLeft % 60

  const formattedTime = `${String(
    minutes
  ).padStart(2, '0')}:${String(
    seconds
  ).padStart(2, '0')}`

  const timerColor =
    timeLeft <= 30
      ? 'var(--red)'
      : timeLeft <= 60
        ? 'var(--amber)'
        : 'var(--teal)'

  const isLastQuestion =
    currentIndex === totalQuestions - 1

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
            TOP HEADER
        =================================== */}

        <div className="quiz-play-header">
          <div
            style={{
              minWidth: 0
            }}
          >
            <span className="eyebrow">
              {quiz.category || 'General'}
            </span>

            <h1
              style={{
                marginTop: 7,
                marginBottom: 7,
                fontSize:
                  'clamp(25px, 7vw, 36px)',
                overflowWrap: 'anywhere'
              }}
            >
              {quiz.title}
            </h1>

            <span
              style={{
                color: 'var(--muted)',
                fontFamily:
                  'var(--font-mono)',
                fontSize: 11
              }}
            >
              {answeredCount}/{totalQuestions}{' '}
              answered
            </span>
          </div>

          {/* TIMER */}

          <div
            className="quiz-timer"
            style={{
              borderColor: timerColor
            }}
          >
            <span
              style={{
                display: 'block',
                marginBottom: 4,
                color: 'var(--muted)',
                fontFamily:
                  'var(--font-mono)',
                fontSize: 9,
                letterSpacing: '0.08em'
              }}
            >
              TIME LEFT
            </span>

            <strong
              style={{
                color: timerColor,
                fontFamily:
                  'var(--font-mono)',
                fontSize: 20
              }}
            >
              {formattedTime}
            </strong>
          </div>
        </div>

        {/* ==================================
            PROGRESS
        =================================== */}

        <div
          style={{
            marginBottom: 24
          }}
        >
          <div
            style={{
              display: 'flex',
              justifyContent:
                'space-between',
              gap: 12,
              marginBottom: 8,
              color: 'var(--muted)',
              fontFamily:
                'var(--font-mono)',
              fontSize: 10
            }}
          >
            <span>
              Question {currentIndex + 1}
            </span>

            <span>
              {totalQuestions} total
            </span>
          </div>

          <div
            style={{
              width: '100%',
              height: 8,
              overflow: 'hidden',
              borderRadius: 999,
              background:
                'var(--panel-raised)'
            }}
          >
            <div
              style={{
                width: `${progress}%`,
                height: '100%',
                borderRadius: 999,
                background: 'var(--amber)',
                transition:
                  'width 0.25s ease'
              }}
            />
          </div>
        </div>

        {/* ==================================
            QUESTION CARD
        =================================== */}

        <section
          className="card"
          style={{
            marginBottom: 20
          }}
        >
          <div
            style={{
              display: 'flex',
              justifyContent:
                'space-between',
              alignItems: 'center',
              gap: 12,
              flexWrap: 'wrap',
              marginBottom: 22
            }}
          >
            <span className="eyebrow">
              Question {currentIndex + 1}
            </span>

            <span className="pill">
              {currentIndex + 1}/
              {totalQuestions}
            </span>
          </div>

          {/* QUESTION */}

          <h2
            style={{
              marginBottom: 26,
              fontSize:
                'clamp(20px, 6vw, 28px)',
              lineHeight: 1.45,
              overflowWrap: 'anywhere'
            }}
          >
            {currentQuestion.questionText ||
              currentQuestion.question}
          </h2>

          {/* ==================================
              OPTIONS
          =================================== */}

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: '1fr',
              gap: 12
            }}
          >
            {(currentQuestion.options || []).map(
              (option, optionIndex) => {
                const selected =
                  selectedOption ===
                  optionIndex

                const optionText =
                  typeof option === 'string'
                    ? option
                    : option.text ||
                      option.optionText ||
                      ''

                return (
                  <button
                    key={optionIndex}
                    type="button"
                    onClick={() =>
                      selectAnswer(
                        questionId,
                        optionIndex
                      )
                    }
                    disabled={submitting}
                    aria-pressed={selected}
                    className="quiz-option"
                    style={{
                      width: '100%',
                      display: 'flex',
                      alignItems: 'center',
                      gap: 13,
                      minHeight: 56,
                      padding: '12px 14px',
                      textAlign: 'left',
                      border: selected
                        ? '1px solid var(--amber)'
                        : '1px solid var(--border)',
                      borderRadius: 10,
                      background: selected
                        ? 'rgba(245, 166, 35, 0.08)'
                        : 'var(--panel-raised)',
                      color: selected
                        ? 'var(--paper)'
                        : 'var(--muted)'
                    }}
                  >
                    {/* OPTION LETTER */}

                    <span
                      style={{
                        width: 34,
                        height: 34,
                        flexShrink: 0,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent:
                          'center',
                        borderRadius: 8,
                        background: selected
                          ? 'var(--amber)'
                          : 'var(--panel)',
                        color: selected
                          ? 'var(--ink)'
                          : 'var(--muted)',
                        fontFamily:
                          'var(--font-mono)',
                        fontWeight: 700,
                        fontSize: 12
                      }}
                    >
                      {String.fromCharCode(
                        65 + optionIndex
                      )}
                    </span>

                    {/* OPTION TEXT */}

                    <span
                      style={{
                        minWidth: 0,
                        flex: 1,
                        lineHeight: 1.5,
                        overflowWrap:
                          'anywhere'
                      }}
                    >
                      {optionText}
                    </span>

                    {/* SELECTED */}

                    {selected && (
                      <span
                        aria-hidden="true"
                        style={{
                          flexShrink: 0,
                          color:
                            'var(--amber)',
                          fontWeight: 700
                        }}
                      >
                        ✓
                      </span>
                    )}
                  </button>
                )
              }
            )}
          </div>
        </section>

        {/* ==================================
            QUESTION NAVIGATION
        =================================== */}

        <div className="quiz-navigation">
          <button
            type="button"
            className="btn btn-ghost"
            onClick={previousQuestion}
            disabled={
              currentIndex === 0 ||
              submitting
            }
          >
            ← Previous
          </button>

          {!isLastQuestion ? (
            <button
              type="button"
              className="btn btn-primary"
              onClick={nextQuestion}
              disabled={submitting}
            >
              Next →
            </button>
          ) : (
            <button
              type="button"
              className="btn btn-primary"
              onClick={submitQuiz}
              disabled={submitting}
            >
              {submitting
                ? 'Submitting...'
                : 'Submit Quiz'}
            </button>
          )}
        </div>

        {/* ==================================
            ERROR
        =================================== */}

        {error && (
          <div
            role="alert"
            style={{
              marginTop: 18,
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
            QUESTION NUMBER NAVIGATION
        =================================== */}

        <div
          className="card"
          style={{
            marginTop: 22
          }}
        >
          <div
            style={{
              display: 'flex',
              justifyContent:
                'space-between',
              alignItems: 'center',
              gap: 12,
              flexWrap: 'wrap',
              marginBottom: 16
            }}
          >
            <span className="eyebrow">
              Questions
            </span>

            <span
              style={{
                color: 'var(--muted)',
                fontFamily:
                  'var(--font-mono)',
                fontSize: 10
              }}
            >
              {answeredCount} answered
            </span>
          </div>

          <div className="question-number-grid">
            {questions.map(
              (question, index) => {
                const key =
                  question._id ||
                  `question-${index}`

                const answered =
                  answers[key] !== undefined

                const active =
                  index === currentIndex

                return (
                  <button
                    key={key}
                    type="button"
                    onClick={() => {
                      setCurrentIndex(index)

                      window.scrollTo({
                        top: 0,
                        behavior: 'smooth'
                      })
                    }}
                    disabled={submitting}
                    aria-label={`Go to question ${
                      index + 1
                    }`}
                    style={{
                      minWidth: 42,
                      height: 42,
                      padding: 0,
                      border: active
                        ? '1px solid var(--amber)'
                        : answered
                          ? '1px solid var(--teal)'
                          : '1px solid var(--border)',
                      borderRadius: 8,
                      background: active
                        ? 'var(--amber)'
                        : answered
                          ? 'rgba(63, 198, 166, 0.08)'
                          : 'var(--panel-raised)',
                      color: active
                        ? 'var(--ink)'
                        : answered
                          ? 'var(--teal)'
                          : 'var(--muted)',
                      fontFamily:
                        'var(--font-mono)',
                      fontWeight: 700
                    }}
                  >
                    {index + 1}
                  </button>
                )
              }
            )}
          </div>
        </div>
      </div>
    </main>
  )
}