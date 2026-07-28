import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import Scoreboard from '../components/Scoreboard'

export default function Home() {
  const { user } = useAuth()

  return (
    <div className="container" style={{ paddingTop: 90, paddingBottom: 100 }}>
      <div style={{ display: 'flex', gap: 60, alignItems: 'center', flexWrap: 'wrap' }}>
        <div style={{ flex: '1 1 420px' }}>
          <span className="eyebrow">Live quiz platform</span>
          <h1 style={{ fontSize: 52, lineHeight: 1.05, margin: '14px 0 20px' }}>
            Every answer<br />on the clock.
          </h1>
          <p style={{ color: 'var(--muted)', fontSize: 17, maxWidth: 460, marginBottom: 32 }}>
            Create quizzes, race the timer, and see your score flip up like a real
            gameshow board. Built for classrooms, teams, and trivia nights.
          </p>
          <div style={{ display: 'flex', gap: 14 }}>
            <Link to={user ? '/dashboard' : '/register'} className="btn btn-primary">
              {user ? 'Go to dashboard' : 'Start playing free'}
            </Link>
            <Link to="/login" className="btn btn-ghost">I have an account</Link>
          </div>
        </div>

        <div className="card" style={{ flex: '1 1 320px', textAlign: 'center' }}>
          <span className="eyebrow">Sample round</span>
          <div style={{ margin: '20px 0' }}>
            <Scoreboard value={12} digits={2} />
          </div>
          <p style={{ color: 'var(--muted)', fontSize: 13, fontFamily: 'var(--font-mono)' }}>
            seconds left
          </p>
          <div style={{ height: 1, background: 'var(--border)', margin: '24px 0' }} />
          <span className="eyebrow">Your score</span>
          <div style={{ margin: '20px 0' }}>
            <Scoreboard value={870} digits={4} />
          </div>
        </div>
      </div>
    </div>
  )
}