import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function Home() {
  const { user } = useAuth()

  return (
    <main>
      {/* ==========================================
          HERO SECTION
      ========================================== */}

      <section className="home-hero">
        <div className="container">
          <div className="home-hero-grid">

            {/* ==================================
                LEFT CONTENT
            =================================== */}

            <div className="home-hero-content">
              <span className="eyebrow">
                Test your knowledge
              </span>

              <h1
                style={{
                  marginTop: 12,
                  marginBottom: 18
                }}
              >
                Learn.
                <br />
                Play.
                <br />

                <span
                  style={{
                    color: 'var(--amber)'
                  }}
                >
                  Master.
                </span>
              </h1>

              <p
                style={{
                  maxWidth: 560,
                  margin: 0,
                  color: 'var(--muted)',
                  fontSize: 16,
                  lineHeight: 1.8
                }}
              >
                Challenge yourself with quizzes,
                improve your knowledge, track your
                scores and compete on the
                leaderboard.
              </p>

              {/* ==================================
                  ACTION BUTTONS
              =================================== */}

              <div className="home-hero-actions">
                {user ? (
                  <>
                    <Link
                      to="/dashboard"
                      className="btn btn-primary"
                    >
                      Go to Dashboard
                    </Link>

                    <Link
                      to="/history"
                      className="btn btn-ghost"
                    >
                      View History
                    </Link>

                    {user.role === 'admin' && (
                      <Link
                        to="/admin"
                        className="btn btn-ghost"
                        style={{
                          color: 'var(--amber)',
                          borderColor: 'var(--amber)'
                        }}
                      >
                        Admin Panel
                      </Link>
                    )}
                  </>
                ) : (
                  <>
                    <Link
                      to="/register"
                      className="btn btn-primary"
                    >
                      Start Playing
                    </Link>

                    <Link
                      to="/login"
                      className="btn btn-ghost"
                    >
                      Log in
                    </Link>
                  </>
                )}
              </div>

              {/* ==================================
                  SMALL FEATURES
              =================================== */}

              <div
                style={{
                  display: 'flex',
                  flexWrap: 'wrap',
                  gap: 10,
                  marginTop: 30
                }}
              >
                <span className="pill">
                  Multiple Categories
                </span>

                <span className="pill">
                  Timed Quizzes
                </span>

                <span className="pill">
                  Leaderboards
                </span>

                <span className="pill">
                  Score History
                </span>
              </div>
            </div>

            {/* ==================================
                RIGHT PREVIEW CARD
            =================================== */}

            <div className="home-hero-card">
              <div
                className="card"
                style={{
                  position: 'relative',
                  overflow: 'hidden'
                }}
              >
                {/* Decorative background */}

                <div
                  aria-hidden="true"
                  style={{
                    position: 'absolute',
                    width: 180,
                    height: 180,
                    borderRadius: '50%',
                    background:
                      'rgba(245, 166, 35, 0.07)',
                    top: -80,
                    right: -70,
                    pointerEvents: 'none'
                  }}
                />

                <div
                  aria-hidden="true"
                  style={{
                    position: 'absolute',
                    width: 130,
                    height: 130,
                    borderRadius: '50%',
                    background:
                      'rgba(63, 198, 166, 0.06)',
                    bottom: -65,
                    left: -50,
                    pointerEvents: 'none'
                  }}
                />

                {/* Card content */}

                <div
                  style={{
                    position: 'relative',
                    zIndex: 1
                  }}
                >
                  <div
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      gap: 12,
                      flexWrap: 'wrap',
                      marginBottom: 26
                    }}
                  >
                    <span className="eyebrow">
                      Quick Challenge
                    </span>

                    <span
                      className="pill"
                      style={{
                        color: 'var(--teal)',
                        borderColor: 'var(--teal)'
                      }}
                    >
                      Easy
                    </span>
                  </div>

                  <h2
                    style={{
                      fontSize: 'clamp(24px, 7vw, 32px)',
                      marginBottom: 12
                    }}
                  >
                    Ready for a quiz?
                  </h2>

                  <p
                    style={{
                      color: 'var(--muted)',
                      marginTop: 0,
                      marginBottom: 28
                    }}
                  >
                    Choose a category, answer the
                    questions before time runs out
                    and see how high you can score.
                  </p>

                  {/* ==================================
                      MOCK QUESTION
                  =================================== */}

                  <div
                    style={{
                      padding: 16,
                      background:
                        'var(--panel-raised)',
                      border:
                        '1px solid var(--border)',
                      borderRadius: 12,
                      marginBottom: 18
                    }}
                  >
                    <span
                      style={{
                        display: 'block',
                        color: 'var(--muted)',
                        fontFamily:
                          'var(--font-mono)',
                        fontSize: 11,
                        marginBottom: 9
                      }}
                    >
                      QUESTION 01
                    </span>

                    <p
                      style={{
                        margin: 0,
                        color: 'var(--paper)',
                        fontFamily:
                          'var(--font-display)',
                        fontWeight: 600,
                        lineHeight: 1.5
                      }}
                    >
                      Which answer will you choose?
                    </p>
                  </div>

                  {/* ==================================
                      MOCK OPTIONS
                  =================================== */}

                  <div
                    style={{
                      display: 'grid',
                      gridTemplateColumns: '1fr',
                      gap: 9
                    }}
                  >
                    <PreviewOption
                      letter="A"
                      text="Think"
                    />

                    <PreviewOption
                      letter="B"
                      text="Choose"
                      active
                    />

                    <PreviewOption
                      letter="C"
                      text="Learn"
                    />
                  </div>

                  {/* ==================================
                      CARD FOOTER
                  =================================== */}

                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent:
                        'space-between',
                      gap: 12,
                      flexWrap: 'wrap',
                      marginTop: 24,
                      paddingTop: 18,
                      borderTop:
                        '1px solid var(--border)'
                    }}
                  >
                    <div>
                      <span
                        style={{
                          display: 'block',
                          fontFamily:
                            'var(--font-mono)',
                          fontSize: 10,
                          color: 'var(--muted)',
                          marginBottom: 4,
                          textTransform: 'uppercase',
                          letterSpacing: '0.08em'
                        }}
                      >
                        Questions
                      </span>

                      <strong
                        style={{
                          fontFamily:
                            'var(--font-display)',
                          fontSize: 18
                        }}
                      >
                        10
                      </strong>
                    </div>

                    <div>
                      <span
                        style={{
                          display: 'block',
                          fontFamily:
                            'var(--font-mono)',
                          fontSize: 10,
                          color: 'var(--muted)',
                          marginBottom: 4,
                          textTransform: 'uppercase',
                          letterSpacing: '0.08em'
                        }}
                      >
                        Time
                      </span>

                      <strong
                        style={{
                          fontFamily:
                            'var(--font-display)',
                          fontSize: 18
                        }}
                      >
                        5 min
                      </strong>
                    </div>

                    <div>
                      <span
                        style={{
                          display: 'block',
                          fontFamily:
                            'var(--font-mono)',
                          fontSize: 10,
                          color: 'var(--muted)',
                          marginBottom: 4,
                          textTransform: 'uppercase',
                          letterSpacing: '0.08em'
                        }}
                      >
                        Goal
                      </span>

                      <strong
                        style={{
                          fontFamily:
                            'var(--font-display)',
                          fontSize: 18,
                          color: 'var(--amber)'
                        }}
                      >
                        100%
                      </strong>
                    </div>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ==========================================
          FEATURES SECTION
      ========================================== */}

      <section
        style={{
          paddingBottom: 90
        }}
      >
        <div className="container">
          <div
            style={{
              textAlign: 'center',
              maxWidth: 650,
              margin: '0 auto 35px'
            }}
          >
            <span className="eyebrow">
              How it works
            </span>

            <h2
              style={{
                marginTop: 8,
                marginBottom: 12
              }}
            >
              Simple. Fast. Competitive.
            </h2>

            <p
              style={{
                margin: 0,
                color: 'var(--muted)'
              }}
            >
              Pick a quiz, answer the questions
              and track your performance.
            </p>
          </div>

          <div className="quiz-grid">
            <FeatureCard
              number="01"
              title="Choose a Quiz"
              description="Browse quizzes by category and difficulty and choose what you want to play."
            />

            <FeatureCard
              number="02"
              title="Answer Questions"
              description="Complete the quiz before the timer ends and submit your answers."
            />

            <FeatureCard
              number="03"
              title="Track Progress"
              description="Check your score, quiz history and leaderboard position after each attempt."
            />
          </div>
        </div>
      </section>
    </main>
  )
}

/* ==========================================
   PREVIEW OPTION
========================================== */

function PreviewOption({
  letter,
  text,
  active = false
}) {
  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: 12,
        minWidth: 0,
        padding: '11px 13px',
        border: active
          ? '1px solid var(--amber)'
          : '1px solid var(--border)',
        borderRadius: 9,
        background: active
          ? 'rgba(245, 166, 35, 0.08)'
          : 'transparent'
      }}
    >
      <span
        style={{
          width: 28,
          height: 28,
          flexShrink: 0,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          borderRadius: 7,
          background: active
            ? 'var(--amber)'
            : 'var(--panel)',
          color: active
            ? 'var(--ink)'
            : 'var(--muted)',
          fontFamily: 'var(--font-mono)',
          fontWeight: 700,
          fontSize: 12
        }}
      >
        {letter}
      </span>

      <span
        style={{
          minWidth: 0,
          color: active
            ? 'var(--paper)'
            : 'var(--muted)',
          fontSize: 14,
          overflowWrap: 'anywhere'
        }}
      >
        {text}
      </span>
    </div>
  )
}

/* ==========================================
   FEATURE CARD
========================================== */

function FeatureCard({
  number,
  title,
  description
}) {
  return (
    <div className="card quiz-card">
      <span
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          justifyContent: 'center',
          width: 42,
          height: 42,
          borderRadius: 10,
          background:
            'rgba(245, 166, 35, 0.08)',
          border:
            '1px solid rgba(245, 166, 35, 0.25)',
          color: 'var(--amber)',
          fontFamily: 'var(--font-mono)',
          fontSize: 12,
          fontWeight: 700,
          marginBottom: 18
        }}
      >
        {number}
      </span>

      <h3
        style={{
          marginBottom: 10
        }}
      >
        {title}
      </h3>

      <p
        style={{
          margin: 0,
          color: 'var(--muted)',
          lineHeight: 1.7
        }}
      >
        {description}
      </p>
    </div>
  )
}