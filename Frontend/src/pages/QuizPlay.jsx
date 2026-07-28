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
  const [answers, setAnswers] = useState({}) // { questionId: selectedOptionIndex }
  const [timeLeft, setTimeLeft] = useState(0)
  const [submitting, setSubmitting] = useState(false)
  const timerRef = useRef(null)

  useEffect(() => {
    async function fetchQuiz() {
      try {
        const { data } = await api.get(`/quizzes/${id}`)
        setQuiz(data)
        setTimeLeft((data.durationMinutes || 5) * 60)
      } catch (err) {
        setError('Could not load this quiz.')
      } finally {
        setLoading(false)
      }
    }
    fetchQuiz()
  }, [id])

  const handleSubmit = useCallback(async () => {
    if (submitting) return
    setSubmitting(true)
    clearInterval(timerRef.current)
    try {
      const payload = {
        answers: Object.entries(answers).map(([questionId, selectedOption]) => ({
          questionId,
          selectedOption
        }))
      }
      const { data } = await api.post(`/quizzes/${id}/submit`, payload)
      navigate(`/result/${id}`, { state: { result: data } })
    } catch (err) {
      setError('Could not submit your answers. Please try again.')
      setSubmitting(false)
    }
  }, [answers, id, navigate, submitting])

  useEffect(() => {
    if (!quiz) return
    timerRef.current = setInterval(() => {
      setTimeLeft((t) => {
        if (t <= 1) {
          clearInterval(timerRef.current)
          handleSubmit()
          return 0
        }
        return t - 1
      })
    }, 1000)
    return () => clearInterval(timerRef.current)
  }, [quiz, handleSubmit])

  if (loading) {
    return (
      <div className="container" style={{ display: 'flex', justifyContent: 'center', paddingTop: 100 }}>
        <div className="loader" />
      </div>
    )
  }

  if (error || !quiz) {
    return (
      <div className="container" style={{ paddingTop: 80 }}>
        <p className="error-text">{error || 'Quiz not found.'}</p>
      </div>
    )
  }

  const question = quiz.questions[current]
  const minutes = Math.floor(timeLeft / 60)
  const seconds = timeLeft % 60
  const isLast = current === quiz.questions.length - 1
  const answered = answers[question._id] !== undefined

  return (
    <div className="container" style={{ maxWidth: 720, paddingTop: 50, paddingBottom: 100 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 30 }}>
        <span className="pill">Question {current + 1} / {quiz.questions.length}</span>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <Scoreboard value={minutes} digits={2} size="small" danger={timeLeft < 30} />
          <span style={{ fontFamily: 'var(--font-mono)', color: 'var(--muted)' }}>:</span>
          <Scoreboard value={seconds} digits={2} size="small" danger={timeLeft < 30} />
        </div>
      </div>

      <div className="card">
        <h3 style={{ fontSize: 22, marginBottom: 24 }}>{question.text}</h3>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {question.options.map((opt, idx) => {
            const selected = answers[question._id] === idx
            return (
              <button
                key={idx}
                onClick={() => setAnswers({ ...answers, [question._id]: idx })}
                style={{
                  textAlign: 'left',
                  padding: '14px 16px',
                  borderRadius: 10,
                  border: `1px solid ${selected ? 'var(--amber)' : 'var(--border)'}`,
                  background: selected ? 'rgba(245,166,35,0.12)' : 'var(--panel-raised)',
                  color: 'var(--paper)',
                  fontSize: 15,
                  fontFamily: 'var(--font-body)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 12
                }}
              >
                <span style={{
                  width: 22, height: 22, borderRadius: 6, flexShrink: 0,
                  border: `1px solid ${selected ? 'var(--amber)' : 'var(--border)'}`,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontFamily: 'var(--font-mono)', fontSize: 12,
                  color: selected ? 'var(--amber)' : 'var(--muted)'
                }}>
                  {String.fromCharCode(65 + idx)}
                </span>
                {opt}
              </button>
            )
          })}
        </div>
      </div>

      <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 24 }}>
        <button
          className="btn btn-ghost"
          disabled={current === 0}
          onClick={() => setCurrent((c) => c - 1)}
        >
          Back
        </button>

        {isLast ? (
          <button className="btn btn-primary" onClick={handleSubmit} disabled={submitting}>
            {submitting ? 'Submitting…' : 'Submit quiz'}
          </button>
        ) : (
          <button
            className="btn btn-primary"
            onClick={() => setCurrent((c) => c + 1)}
            disabled={!answered}
          >
            Next
          </button>
        )}
      </div>
    </div>
  )
}