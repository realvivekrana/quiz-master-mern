import { Link, useLocation, useParams } from 'react-router-dom'
import Scoreboard from '../components/Scoreboard'

export default function Result() {
  const { state } = useLocation()
  const { id } = useParams()
  const result = state?.result

  if (!result) {
    return (
      <div className="container" style={{ paddingTop: 80 }}>
        <p style={{ color: 'var(--muted)' }}>
          No result to show. <Link to="/dashboard" style={{ color: 'var(--amber)' }}>Back to dashboard</Link>
        </p>
      </div>
    )
  }

  const { score, total, correctCount, incorrectCount, timeTakenSeconds } = result

  return (
    <div className="container" style={{ maxWidth: 560, paddingTop: 70, paddingBottom: 100, textAlign: 'center' }}>
      <span className="eyebrow">Round complete</span>
      <h2 style={{ fontSize: 32, margin: '10px 0 30px' }}>Your final score</h2>

      <div className="card" style={{ marginBottom: 24 }}>
        <div style={{ margin: '10px 0 24px' }}>
          <Scoreboard value={score ?? 0} digits={String(total ?? 100).length + 1} />
        </div>

        <div style={{
          display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 12,
          borderTop: '1px solid var(--border)', paddingTop: 20
        }}>
          <div>
            <div style={{ fontFamily: 'var(--font-display)', fontSize: 22, color: 'var(--teal)' }}>
              {correctCount ?? 0}
            </div>
            <div className="eyebrow" style={{ color: 'var(--muted)' }}>Correct</div>
          </div>
          <div>
            <div style={{ fontFamily: 'var(--font-display)', fontSize: 22, color: 'var(--red)' }}>
              {incorrectCount ?? 0}
            </div>
            <div className="eyebrow" style={{ color: 'var(--muted)' }}>Wrong</div>
          </div>
          <div>
            <div style={{ fontFamily: 'var(--font-display)', fontSize: 22 }}>
              {timeTakenSeconds ?? '—'}s
            </div>
            <div className="eyebrow" style={{ color: 'var(--muted)' }}>Time</div>
          </div>
        </div>
      </div>

      <div style={{ display: 'flex', gap: 14, justifyContent: 'center' }}>
        <Link to={`/quiz/${id}`} className="btn btn-ghost">Play again</Link>
        <Link to="/dashboard" className="btn btn-primary">Back to dashboard</Link>
      </div>
    </div>
  )
}