import { Link, useLocation, useParams } from 'react-router-dom'
import Scoreboard from '../components/Scoreboard'

export default function Result() {
  const { state } = useLocation()
  const { id } = useParams()

  const result = state?.result

  if (!result) {
    return (
      <div
        className="container"
        style={{
          maxWidth: 700,
          paddingTop: 80,
          paddingBottom: 100,
          textAlign: 'center'
        }}
      >
        <div className="card">
          <h2 style={{ marginBottom: 12 }}>No result found</h2>

          <p
            style={{
              color: 'var(--muted)',
              marginBottom: 24
            }}
          >
            Complete a quiz first to see your result.
          </p>

          <Link to="/dashboard" className="btn btn-primary">
            Back to dashboard
          </Link>
        </div>
      </div>
    )
  }

  const {
    score = 0,
    total = 0,
    correctCount = 0,
    incorrectCount = 0,
    timeTakenSeconds = 0
  } = result

  // ==============================
  // Performance message
  // ==============================

  let performanceTitle = 'Keep practising!'
  let performanceText =
    'Every attempt helps. Try the quiz again and improve your score.'

  if (score === 100) {
    performanceTitle = 'Perfect score!'
    performanceText =
      'Outstanding! You answered every question correctly.'
  } else if (score >= 80) {
    performanceTitle = 'Excellent work!'
    performanceText =
      'You have a strong understanding of this topic.'
  } else if (score >= 60) {
    performanceTitle = 'Good job!'
    performanceText =
      'Nice attempt. A little more practice and you can push the score higher.'
  } else if (score >= 40) {
    performanceTitle = 'Getting there!'
    performanceText =
      'You have the basics. Review the topic and give it another shot.'
  }

  // ==============================
  // Time formatting
  // ==============================

  const minutes = Math.floor(timeTakenSeconds / 60)
  const seconds = timeTakenSeconds % 60

  const formattedTime =
    minutes > 0
      ? `${minutes}m ${seconds}s`
      : `${seconds}s`

  return (
    <div
      className="container"
      style={{
        maxWidth: 700,
        paddingTop: 60,
        paddingBottom: 100
      }}
    >
      {/* Heading */}

      <div
        style={{
          textAlign: 'center',
          marginBottom: 30
        }}
      >
        <span className="eyebrow">
          Round complete
        </span>

        <h2
          style={{
            fontSize: 36,
            marginTop: 10,
            marginBottom: 8
          }}
        >
          {performanceTitle}
        </h2>

        <p
          style={{
            color: 'var(--muted)',
            margin: 0,
            lineHeight: 1.6
          }}
        >
          {performanceText}
        </p>
      </div>

      {/* Main result card */}

      <div
        className="card"
        style={{
          marginBottom: 20,
          textAlign: 'center'
        }}
      >
        <span
          className="eyebrow"
          style={{
            color: 'var(--muted)'
          }}
        >
          Your score
        </span>

        <div
          style={{
            margin: '20px 0 12px'
          }}
        >
          <Scoreboard
            value={score}
            digits={3}
          />
        </div>

        <div
          style={{
            fontFamily: 'var(--font-display)',
            fontSize: 18,
            color: 'var(--amber)',
            marginBottom: 28
          }}
        >
          {score}%
        </div>

        {/* Statistics */}

        <div
          style={{
            display: 'grid',
            gridTemplateColumns:
              'repeat(4, minmax(0, 1fr))',
            gap: 12,
            borderTop: '1px solid var(--border)',
            paddingTop: 24
          }}
        >
          <ResultStat
            value={`${correctCount}/${total}`}
            label="Correct"
            valueColor="var(--teal)"
          />

          <ResultStat
            value={incorrectCount}
            label="Wrong"
            valueColor="var(--red)"
          />

          <ResultStat
            value={`${score}%`}
            label="Accuracy"
            valueColor="var(--amber)"
          />

          <ResultStat
            value={formattedTime}
            label="Time"
          />
        </div>
      </div>

      {/* Performance */}

      <div
        className="card"
        style={{
          marginBottom: 24
        }}
      >
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            gap: 16,
            marginBottom: 10
          }}
        >
          <span
            style={{
              fontFamily: 'var(--font-display)',
              fontWeight: 600
            }}
          >
            Performance
          </span>

          <span
            style={{
              fontFamily: 'var(--font-mono)',
              color: 'var(--amber)',
              fontSize: 13
            }}
          >
            {score}%
          </span>
        </div>

        {/* Progress bar */}

        <div
          style={{
            width: '100%',
            height: 10,
            background: 'var(--panel-raised)',
            borderRadius: 999,
            overflow: 'hidden'
          }}
        >
          <div
            style={{
              width: `${Math.min(
                Math.max(score, 0),
                100
              )}%`,
              height: '100%',
              background: 'var(--amber)',
              borderRadius: 999,
              transition: 'width 0.5s ease'
            }}
          />
        </div>
      </div>

      {/* Buttons */}

      <div
        style={{
          display: 'flex',
          gap: 14,
          justifyContent: 'center',
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
          to={`/quiz/${id}/leaderboard`}
          className="btn btn-ghost"
        >
          Leaderboard
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

// ==========================================
// Small Result Statistic Component
// ==========================================

function ResultStat({
  value,
  label,
  valueColor = 'var(--paper)'
}) {
  return (
    <div>
      <div
        style={{
          fontFamily: 'var(--font-display)',
          fontSize: 22,
          fontWeight: 600,
          color: valueColor,
          marginBottom: 5
        }}
      >
        {value}
      </div>

      <div
        className="eyebrow"
        style={{
          color: 'var(--muted)',
          fontSize: 10
        }}
      >
        {label}
      </div>
    </div>
  )
}