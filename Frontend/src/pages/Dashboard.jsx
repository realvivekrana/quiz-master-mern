import { useEffect, useState } from 'react'
import api from '../api/axios'
import QuizCard from '../components/QuizCard'
import { useAuth } from '../context/AuthContext'

export default function Dashboard() {
  const { user } = useAuth()

  const [quizzes, setQuizzes] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    async function fetchQuizzes() {
      try {
        setLoading(true)
        setError('')

        const { data } = await api.get('/quizzes')

        // Backend response:
        // { count: number, quizzes: [...] }
        setQuizzes(data.quizzes || [])
      } catch (err) {
        console.error('Failed to load quizzes:', err)

        setError('Could not load quizzes. Is the backend running?')
      } finally {
        setLoading(false)
      }
    }

    fetchQuizzes()
  }, [])

  return (
    <div
      className="container"
      style={{
        paddingTop: 60,
        paddingBottom: 100
      }}
    >
      <span className="eyebrow">
        Hey {user?.name?.split(' ')[0]}
      </span>

      <h2
        style={{
          fontSize: 34,
          margin: '10px 0 8px'
        }}
      >
        Pick a quiz
      </h2>

      <p
        style={{
          color: 'var(--muted)',
          marginBottom: 36
        }}
      >
        Fresh rounds, same clock pressure every time.
      </p>

      {loading && (
        <div
          style={{
            display: 'flex',
            justifyContent: 'center',
            padding: 60
          }}
        >
          <div className="loader" />
        </div>
      )}

      {error && (
        <p className="error-text">
          {error}
        </p>
      )}

      {!loading && !error && quizzes.length === 0 && (
        <div
          className="card"
          style={{
            textAlign: 'center',
            color: 'var(--muted)'
          }}
        >
          No quizzes yet. Once your backend adds some, they'll show up here.
        </div>
      )}

      {!loading && !error && (
        <div
          style={{
            display: 'grid',
            gridTemplateColumns:
              'repeat(auto-fill, minmax(260px, 1fr))',
            gap: 20
          }}
        >
          {quizzes.map((quiz) => (
            <QuizCard
              key={quiz._id}
              quiz={quiz}
            />
          ))}
        </div>
      )}
    </div>
  )
}