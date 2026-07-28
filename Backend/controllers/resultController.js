import Result from '../models/Result.js'

// ==========================================
// GET /api/results/me
// Logged-in user's quiz history
// ==========================================

export async function getMyResults(req, res) {
  const results = await Result.find({
    user: req.user._id
  })
    .populate(
      'quiz',
      'title description category difficulty durationMinutes'
    )
    .sort({ createdAt: -1 })

  // Deleted quiz ke results remove kar do
  const validResults = results.filter(
    (result) => result.quiz
  )

  const totalAttempts = validResults.length

  const bestScore =
    totalAttempts > 0
      ? Math.max(
          ...validResults.map(
            (result) => result.score
          )
        )
      : 0

  const averageScore =
    totalAttempts > 0
      ? Math.round(
          validResults.reduce(
            (total, result) =>
              total + result.score,
            0
          ) / totalAttempts
        )
      : 0

  res.status(200).json({
    count: totalAttempts,

    stats: {
      totalAttempts,
      bestScore,
      averageScore
    },

    results: validResults
  })
}