import Quiz from '../models/Quiz.js'
import Result from '../models/Result.js'

// GET /api/quizzes
export async function getQuizzes(req, res) {
  const quizzes = await Quiz.find().select('title description category durationMinutes questions')
  const shaped = quizzes.map((q) => ({
    _id: q._id,
    title: q.title,
    description: q.description,
    category: q.category,
    durationMinutes: q.durationMinutes,
    questionCount: q.questions.length
  }))
  res.json(shaped)
}

// GET /api/quizzes/:id  -> never send correctOption to the client
export async function getQuizById(req, res) {
  const quiz = await Quiz.findById(req.params.id)
  if (!quiz) return res.status(404).json({ message: 'Quiz not found' })

  const safeQuiz = {
    _id: quiz._id,
    title: quiz.title,
    description: quiz.description,
    category: quiz.category,
    durationMinutes: quiz.durationMinutes,
    questions: quiz.questions.map((q) => ({
      _id: q._id,
      text: q.text,
      options: q.options
    }))
  }

  res.json(safeQuiz)
}

// POST /api/quizzes/:id/submit
// body: { answers: [{ questionId, selectedOption }], timeTakenSeconds }
export async function submitQuiz(req, res) {
  const quiz = await Quiz.findById(req.params.id)
  if (!quiz) return res.status(404).json({ message: 'Quiz not found' })

  const { answers = [], timeTakenSeconds = null } = req.body
  const answerMap = new Map(answers.map((a) => [String(a.questionId), a.selectedOption]))

  let correctCount = 0
  quiz.questions.forEach((q) => {
    const selected = answerMap.get(String(q._id))
    if (selected !== undefined && Number(selected) === q.correctOption) {
      correctCount += 1
    }
  })

  const total = quiz.questions.length
  const incorrectCount = total - correctCount
  const score = correctCount * 10 // 10 points per correct answer

  const result = await Result.create({
    user: req.user._id,
    quiz: quiz._id,
    score,
    total: total * 10,
    correctCount,
    incorrectCount,
    timeTakenSeconds
  })

  res.status(201).json({
    resultId: result._id,
    score,
    total: total * 10,
    correctCount,
    incorrectCount,
    timeTakenSeconds
  })
}

// POST /api/quizzes  (create a quiz — any logged-in user can add one)
// body: { title, description, category, durationMinutes, questions: [{ text, options, correctOption }] }
export async function createQuiz(req, res) {
  const { title, description, category, durationMinutes, questions } = req.body

  if (!title || !Array.isArray(questions) || questions.length === 0) {
    return res.status(400).json({ message: 'Title and at least one question are required' })
  }

  for (const q of questions) {
    if (!q.text || !Array.isArray(q.options) || q.options.length < 2) {
      return res.status(400).json({ message: 'Each question needs text and at least 2 options' })
    }
    if (
      q.correctOption === undefined ||
      q.correctOption < 0 ||
      q.correctOption >= q.options.length
    ) {
      return res.status(400).json({ message: 'Each question needs a valid correctOption index' })
    }
  }

  const quiz = await Quiz.create({
    title,
    description,
    category,
    durationMinutes,
    questions,
    createdBy: req.user._id
  })

  res.status(201).json(quiz)
}

// GET /api/quizzes/:id/leaderboard
export async function getLeaderboard(req, res) {
  const results = await Result.find({ quiz: req.params.id })
    .sort({ score: -1, timeTakenSeconds: 1 })
    .limit(10)
    .populate('user', 'name')

  res.json(
    results.map((r) => ({
      name: r.user?.name || 'Unknown',
      score: r.score,
      total: r.total,
      timeTakenSeconds: r.timeTakenSeconds,
      achievedAt: r.createdAt
    }))
  )
}