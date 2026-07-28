import { useCallback, useEffect, useRef, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import api from '../api/axios'
import Scoreboard from '../components/Scoreboard'

export default function QuizPlay() {
  const { id } = useParams()
  const navigate = useNavigate()

  const [quiz, setQuiz] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [current, setCurrent] = useState(0)

  // { questionId: selectedOptionIndex }
  const [answers, setAnswers] = useState({})

  const [timeLeft, setTimeLeft] = useState(0)
  const [submitting, setSubmitting] = useState(false)

  const timerRef = useRef(null)

  // ==============================
  // Load Quiz
  // ==============================
  useEffect(() => {
    async function fetchQuiz() {
      try {
        setLoading(true)
        setError('')

        const { data } = await api.get(`/quizzes/${id}`)

        const quizData = data.quiz

        if (!quizData) {
          throw new Error('Quiz not found')
        }

        setQuiz(quizData)

        // Current model doesn't have durationMinutes,
        // so default is 5 minutes.
        setTimeLeft((quizData.durationMinutes || 5) * 60)
      } catch (err) {
        console.error('Failed to load quiz:', err)
        setError('Could not load this quiz.')
      } finally {
        setLoading(false)
      }
    }

    fetchQuiz()
  }, [id])

  // ==============================
  // Submit Quiz
  // ==============================
  const handleSubmit = useCallback(async () => {
    if (submitting || !quiz) return

    // Backend expects one option index for every question.
    const answerArray = quiz.questions.map(
      (question) => answers[question._id]
    )

    const hasUnanswered = answerArray.some(
      (answer) => answer === undefined
    )

    if (hasUnanswered) {
      setError('Please answer all questions before submitting.')
      return
    }

    setSubmitting(true)
    setError('')

    clearInterval(timerRef.current)

    try {
      const totalDurationSeconds =
        (quiz.durationMinutes || 5) * 60

      const timeTakenSeconds =
        totalDurationSeconds - timeLeft

      const payload = {
        answers: answerArray,
        timeTakenSeconds
      }

      const { data } = await api.post(
        `/quizzes/${id}/submit`,
        payload
      )

      navigate(`/result/${id}`, {
        state: {
          result: data.result
        }
      })
    } catch (err) {
      console.error('Submit error:', err)

      setError(
        err.response?.data?.message ||
          'Could not submit your answers. Please try again.'
      )

      setSubmitting(false)
    }
  }, [
    answers,
    id,
    navigate,
    quiz,
    submitting,
    timeLeft
  ])

  // ==============================
  // Timer
  // ==============================
  useEffect(() => {
    if (!quiz) return

    timerRef.current = setInterval(() => {
      setTimeLeft((time) => {
        if (time <= 1) {
          clearInterval(timerRef.current)
          return 0
        }

        return time - 1
      })
    }, 1000)

    return () => {
      clearInterval(timerRef.current)
    }
  }, [quiz])

  // Auto-submit when timer reaches zero
  useEffect(() => {
    if (!quiz || timeLeft !== 0) return

    // Don't auto-submit immediately when quiz first loads
    // before timer has been initialized.
    if (loading) return

    handleSubmit()
  }, [timeLeft, quiz, loading, handleSubmit])

  // ==============================
  // Loading
  // ==============================
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

  // ==============================
  // Error / Quiz Not Found
  // ==============================
  if (!quiz) {
    return (
      <div
        className="container"
        style={{ paddingTop: 80 }}
      >
        <p className="error-text">
          {error || 'Quiz not found.'}
        </p>
      </div>
    )
  }

  if (!quiz.questions?.length) {
    return (
      <div
        className="container"
        style={{ paddingTop: 80 }}
      >
        <p className="error-text">
          This quiz has no questions.
        </p>
      </div>
    )
  }

  const question = quiz.questions[current]

  const minutes = Math.floor(timeLeft / 60)
  const seconds = timeLeft % 60

  const isLast =
    current === quiz.questions.length - 1

  const answered =
    answers[question._id] !== undefined

  // ==============================
  // UI
  // ==============================
  return (
    <div
      className="container"
      style={{
        maxWidth: 720,
        paddingTop: 50,
        paddingBottom: 100
      }}
    >
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: 30
        }}
      >
        <span className="pill">
          Question {current + 1} / {quiz.questions.length}
        </span>

        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 10
          }}
        >
          <Scoreboard
            value={minutes}
            digits={2}
            size="small"
            danger={timeLeft < 30}
          />

          <span
            style={{
              fontFamily: 'var(--font-mono)',
              color: 'var(--muted)'
            }}
          >
            :
          </span>

          <Scoreboard
            value={seconds}
            digits={2}
            size="small"
            danger={timeLeft < 30}
          />
        </div>
      </div>

      <div className="card">
        <h3
          style={{
            fontSize: 22,
            marginBottom: 24
          }}
        >
          {question.questionText}
        </h3>

        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: 12
          }}
        >
          {question.options.map((option, index) => {
            const selected =
              answers[question._id] === index

            return (
              <button
                key={index}
                type="button"
                onClick={() =>
                  setAnswers((previous) => ({
                    ...previous,
                    [question._id]: index
                  }))
                }
                style={{
                  textAlign: 'left',
                  padding: '14px 16px',
                  borderRadius: 10,

                  border: `1px solid ${
                    selected
                      ? 'var(--amber)'
                      : 'var(--border)'
                  }`,

                  background: selected
                    ? 'rgba(245,166,35,0.12)'
                    : 'var(--panel-raised)',

                  color: 'var(--paper)',
                  fontSize: 15,
                  fontFamily: 'var(--font-body)',

                  display: 'flex',
                  alignItems: 'center',
                  gap: 12,
                  cursor: 'pointer'
                }}
              >
                <span
                  style={{
                    width: 22,
                    height: 22,
                    borderRadius: 6,
                    flexShrink: 0,

                    border: `1px solid ${
                      selected
                        ? 'var(--amber)'
                        : 'var(--border)'
                    }`,

                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',

                    fontFamily: 'var(--font-mono)',
                    fontSize: 12,

                    color: selected
                      ? 'var(--amber)'
                      : 'var(--muted)'
                  }}
                >
                  {String.fromCharCode(65 + index)}
                </span>

                {option.text}
              </button>
            )
          })}
        </div>
      </div>

      {error && (
        <p
          className="error-text"
          style={{ marginTop: 16 }}
        >
          {error}
        </p>
      )}

      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          marginTop: 24
        }}
      >
        <button
          className="btn btn-ghost"
          disabled={current === 0}
          onClick={() =>
            setCurrent((value) => value - 1)
          }
        >
          Back
        </button>

        {isLast ? (
          <button
            className="btn btn-primary"
            onClick={handleSubmit}
            disabled={submitting || !answered}
          >
            {submitting
              ? 'Submitting…'
              : 'Submit quiz'}
          </button>
        ) : (
          <button
            className="btn btn-primary"
            onClick={() =>
              setCurrent((value) => value + 1)
            }
            disabled={!answered}
          >
            Next
          </button>
        )}
      </div>
    </div>
  )
}