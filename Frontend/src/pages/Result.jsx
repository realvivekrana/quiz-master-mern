import { Link, useLocation, useParams } from 'react-router-dom'
import Scoreboard from '../components/Scoreboard'

export default function Result() {
  const { state } = useLocation()
  const { id } = useParams()

  const result = state?.result

  // ==========================================
  // NO RESULT
  // ==========================================

  if (!result) {
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
            <div
              style={{
                width: 52,
                height: 52,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 18px',
                borderRadius: 12,
                background:
                  'rgba(245, 166, 35, 0.08)',
                color: 'var(--amber)',
                fontFamily: 'var(--font-display)',
                fontSize: 22,
                fontWeight: 700
              }}
            >
              ?
            </div>

            <h2
              style={{
                marginBottom: 10
              }}
            >
              No result found
            </h2>

            <p
              style={{
                maxWidth: 450,
                margin: '0 auto 24px',
                color: 'var(--muted)',
                lineHeight: 1.7
              }}
            >
              Complete a quiz first to see your
              result.
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

  // ==========================================
  // RESULT VALUES
  // ==========================================

  const {
    score = 0,
    total = 0,
    correctCount = 0,
    incorrectCount = 0,
    timeTakenSeconds = 0
  } = result

  // Keep values safe for UI

  const safeScore = Math.min(
    Math.max(Number(score) || 0, 0),
    100
  )

  const safeTotal = Number(total) || 0

  const safeCorrect =
    Number(correctCount) || 0

  const safeIncorrect =
    Number(incorrectCount) || 0

  const safeTime =
    Number(timeTakenSeconds) || 0

  // ==========================================
  // PERFORMANCE MESSAGE
  // ==========================================

  let performanceTitle =
    'Keep practising!'

  let performanceText =
    'Every attempt helps. Try the quiz again and improve your score.'

  let performanceColor = 'var(--red)'

  if (safeScore === 100) {
    performanceTitle = 'Perfect score!'

    performanceText =
      'Outstanding! You answered every question correctly.'

    performanceColor = 'var(--teal)'
  } else if (safeScore >= 80) {
    performanceTitle = 'Excellent work!'

    performanceText =
      'You have a strong understanding of this topic.'

    performanceColor = 'var(--teal)'
  } else if (safeScore >= 60) {
    performanceTitle = 'Good job!'

    performanceText =
      'Nice attempt. A little more practice and you can push the score higher.'

    performanceColor = 'var(--amber)'
  } else if (safeScore >= 40) {
    performanceTitle = 'Getting there!'

    performanceText =
      'You have the basics. Review the topic and give it another shot.'

    performanceColor = 'var(--amber)'
  }

  // ==========================================
  // TIME FORMAT
  // ==========================================

  const minutes = Math.floor(
    safeTime / 60
  )

  const seconds = safeTime % 60

  const formattedTime =
    minutes > 0
      ? `${minutes}m ${seconds}s`
      : `${seconds}s`

  // ==========================================
  // PAGE
  // ==========================================

  return (
    <main className="page">
      <div
        className="container"
        style={{
          maxWidth: 760
        }}
      >
        {/* ==================================
            HEADING
        =================================== */}

        <div
          style={{
            textAlign: 'center',
            marginBottom: 28
          }}
        >
          <span className="eyebrow">
            Round complete
          </span>

          <h1
            style={{
              marginTop: 9,
              marginBottom: 9,
              fontSize:
                'clamp(28px, 8vw, 40px)',
              color: performanceColor
            }}
          >
            {performanceTitle}
          </h1>

          <p
            style={{
              maxWidth: 560,
              margin: '0 auto',
              color: 'var(--muted)',
              lineHeight: 1.7
            }}
          >
            {performanceText}
          </p>
        </div>

        {/* ==================================
            MAIN SCORE CARD
        =================================== */}

        <section
          className="card"
          style={{
            marginBottom: 18,
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

          {/* SCOREBOARD */}

          <div
            className="result-scoreboard"
            style={{
              margin: '20px 0 10px'
            }}
          >
            <Scoreboard
              value={safeScore}
              digits={3}
            />
          </div>

          <div
            style={{
              color: performanceColor,
              fontFamily:
                'var(--font-display)',
              fontSize:
                'clamp(18px, 5vw, 22px)',
              fontWeight: 700,
              marginBottom: 26
            }}
          >
            {safeScore}%
          </div>

          {/* ==================================
              RESULT STATS
          =================================== */}

          <div className="result-stats-grid">
            <ResultStat
              value={`${safeCorrect}/${safeTotal}`}
              label="Correct"
              valueColor="var(--teal)"
            />

            <ResultStat
              value={safeIncorrect}
              label="Wrong"
              valueColor="var(--red)"
            />

            <ResultStat
              value={`${safeScore}%`}
              label="Accuracy"
              valueColor="var(--amber)"
            />

            <ResultStat
              value={formattedTime}
              label="Time"
            />
          </div>
        </section>

        {/* ==================================
            PERFORMANCE CARD
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
              gap: 14,
              marginBottom: 12
            }}
          >
            <div>
              <span
                className="eyebrow"
                style={{
                  color: 'var(--muted)'
                }}
              >
                Performance
              </span>

              <h3
                style={{
                  marginTop: 5,
                  marginBottom: 0
                }}
              >
                Overall accuracy
              </h3>
            </div>

            <strong
              style={{
                flexShrink: 0,
                color: performanceColor,
                fontFamily:
                  'var(--font-mono)',
                fontSize: 15
              }}
            >
              {safeScore}%
            </strong>
          </div>

          {/* PROGRESS BAR */}

          <div
            style={{
              width: '100%',
              height: 10,
              overflow: 'hidden',
              borderRadius: 999,
              background:
                'var(--panel-raised)'
            }}
          >
            <div
              style={{
                width: `${safeScore}%`,
                height: '100%',
                borderRadius: 999,
                background:
                  performanceColor,
                transition:
                  'width 0.5s ease'
              }}
            />
          </div>

          {/* ==================================
              PERFORMANCE LABEL
          =================================== */}

          <div
            style={{
              display: 'flex',
              justifyContent:
                'space-between',
              gap: 10,
              marginTop: 9,
              color: 'var(--muted)',
              fontFamily:
                'var(--font-mono)',
              fontSize: 9
            }}
          >
            <span>0%</span>
            <span>50%</span>
            <span>100%</span>
          </div>
        </section>

        {/* ==================================
            SUMMARY
        =================================== */}

        <section
          className="card"
          style={{
            marginBottom: 24
          }}
        >
          <span className="eyebrow">
            Attempt summary
          </span>

          <div
            className="result-summary-grid"
            style={{
              marginTop: 16
            }}
          >
            <SummaryItem
              label="Questions"
              value={safeTotal}
            />

            <SummaryItem
              label="Answered correctly"
              value={safeCorrect}
              color="var(--teal)"
            />

            <SummaryItem
              label="Incorrect"
              value={safeIncorrect}
              color="var(--red)"
            />

            <SummaryItem
              label="Time taken"
              value={formattedTime}
              color="var(--amber)"
            />
          </div>
        </section>

        {/* ==================================
            ACTION BUTTONS
        =================================== */}

        <div className="result-actions">
          <Link
            to={`/quiz/${id}`}
            className="btn btn-ghost"
          >
            Play Again
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
            Dashboard
          </Link>
        </div>
      </div>
    </main>
  )
}

// ==========================================
// RESULT STAT
// ==========================================

function ResultStat({
  value,
  label,
  valueColor = 'var(--paper)'
}) {
  return (
    <div className="result-stat">
      <div
        style={{
          color: valueColor,
          fontFamily:
            'var(--font-display)',
          fontSize:
            'clamp(19px, 6vw, 24px)',
          fontWeight: 700,
          overflowWrap: 'anywhere'
        }}
      >
        {value}
      </div>

      <span
        className="eyebrow"
        style={{
          display: 'block',
          marginTop: 6,
          color: 'var(--muted)',
          fontSize: 9
        }}
      >
        {label}
      </span>
    </div>
  )
}

// ==========================================
// SUMMARY ITEM
// ==========================================

function SummaryItem({
  label,
  value,
  color = 'var(--paper)'
}) {
  return (
    <div className="result-summary-item">
      <span
        style={{
          color: 'var(--muted)',
          fontSize: 12
        }}
      >
        {label}
      </span>

      <strong
        style={{
          color,
          fontFamily:
            'var(--font-display)',
          fontSize: 17,
          overflowWrap: 'anywhere'
        }}
      >
        {value}
      </strong>
    </div>
  )
}