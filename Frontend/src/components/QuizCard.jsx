import { useNavigate } from 'react-router-dom'

export default function QuizCard({ quiz }) {
  const navigate = useNavigate()

  const questionCount =
    quiz.questions?.length ??
    quiz.questionCount ??
    0

  const category =
    quiz.category || 'General'

  const difficulty =
    quiz.difficulty || 'Easy'

  const duration =
    quiz.durationMinutes || 5

  // Difficulty ke hisaab se color
  const difficultyColor =
    difficulty === 'Hard'
      ? 'var(--red)'
      : difficulty === 'Medium'
        ? 'var(--amber)'
        : 'var(--teal)'

  return (
    <div
      className="card"
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: 16,
        minHeight: 250,
        transition:
          'transform 0.2s ease, border-color 0.2s ease'
      }}
    >
      {/* Category + Difficulty */}

      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          gap: 10
        }}
      >
        <span className="eyebrow">
          {category}
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

      {/* Title */}

      <h3
        style={{
          fontSize: 21,
          lineHeight: 1.3
        }}
      >
        {quiz.title}
      </h3>

      {/* Description */}

      <p
        style={{
          color: 'var(--muted)',
          fontSize: 14,
          lineHeight: 1.6,
          margin: 0,
          flex: 1
        }}
      >
        {quiz.description ||
          'Test your knowledge and climb the leaderboard.'}
      </p>

      {/* Quiz Information */}

      <div
        style={{
          display: 'flex',
          gap: 10,
          flexWrap: 'wrap'
        }}
      >
        <span className="pill">
          {questionCount} Questions
        </span>

        <span className="pill">
          {duration} min
        </span>
      </div>

      {/* Bottom */}

      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          gap: 15,
          paddingTop: 15,
          borderTop: '1px solid var(--border)'
        }}
      >
        <span
          style={{
            fontFamily: 'var(--font-mono)',
            fontSize: 11,
            color: 'var(--muted)'
          }}
        >
          Ready to play?
        </span>

        <button
          type="button"
          className="btn btn-primary"
          onClick={() =>
            navigate(`/quiz/${quiz._id}`)
          }
        >
          Play
        </button>
      </div>
    </div>
  )
}