import { useNavigate } from 'react-router-dom'

export default function QuizCard({ quiz }) {
  const navigate = useNavigate()

  return (
    <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <span className="eyebrow">{quiz.category || 'General'}</span>
        <span className="pill">{quiz.questions?.length ?? quiz.questionCount ?? 0} Qs</span>
      </div>

      <h3 style={{ fontSize: 20 }}>{quiz.title}</h3>
      <p style={{ color: 'var(--muted)', fontSize: 14, margin: 0, flex: 1 }}>
        {quiz.description || 'Test your knowledge and climb the leaderboard.'}
      </p>

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <span style={{ fontFamily: 'var(--font-mono)', fontSize: 12, color: 'var(--muted)' }}>
          {quiz.durationMinutes || 5} min
        </span>
        <button className="btn btn-primary" onClick={() => navigate(`/quiz/${quiz._id}`)}>
          Play
        </button>
      </div>
    </div>
  )
}