import Quiz from '../models/Quiz.js'
import Result from '../models/Result.js'

// ==========================================
// GET /api/quizzes
// Get all quizzes
// ==========================================

export async function getQuizzes(req, res) {
  const quizzes = await Quiz.find()
    .populate('createdBy', 'name email')
    .sort({ createdAt: -1 })

  res.status(200).json({
    count: quizzes.length,
    quizzes
  })
}

// ==========================================
// GET /api/quizzes/:id
// Get single quiz
// ==========================================

export async function getQuizById(req, res) {
  const quiz = await Quiz.findById(req.params.id)
    .populate('createdBy', 'name email')

  if (!quiz) {
    return res.status(404).json({
      message: 'Quiz not found'
    })
  }

  res.status(200).json({
    quiz
  })
}

// ==========================================
// POST /api/quizzes
// Create Quiz - Admin Only
// ==========================================

export async function createQuiz(req, res) {
  const {
    title,
    description,
    category,
    difficulty,
    durationMinutes,
    questions
  } = req.body

  // ========================================
  // Title Validation
  // ========================================

  if (!title || !title.trim()) {
    return res.status(400).json({
      message: 'Quiz title is required'
    })
  }

  // ========================================
  // Questions Validation
  // ========================================

  if (
    !Array.isArray(questions) ||
    questions.length === 0
  ) {
    return res.status(400).json({
      message: 'At least one question is required'
    })
  }

  // ========================================
  // Difficulty Validation
  // ========================================

  const allowedDifficulties = [
    'Easy',
    'Medium',
    'Hard'
  ]

  const quizDifficulty =
    difficulty || 'Easy'

  if (
    !allowedDifficulties.includes(
      quizDifficulty
    )
  ) {
    return res.status(400).json({
      message:
        'Difficulty must be Easy, Medium or Hard'
    })
  }

  // ========================================
  // Duration Validation
  // ========================================

  const parsedDuration =
    durationMinutes === undefined ||
    durationMinutes === null ||
    durationMinutes === ''
      ? 5
      : Number(durationMinutes)

  if (
    !Number.isInteger(parsedDuration) ||
    parsedDuration < 1 ||
    parsedDuration > 120
  ) {
    return res.status(400).json({
      message:
        'Duration must be between 1 and 120 minutes'
    })
  }

  // ========================================
  // Validate Every Question
  // ========================================

  for (const question of questions) {
    if (
      !question.questionText ||
      !question.questionText.trim()
    ) {
      return res.status(400).json({
        message: 'Question text is required'
      })
    }

    if (
      !Array.isArray(question.options) ||
      question.options.length < 2
    ) {
      return res.status(400).json({
        message:
          'Each question must have at least 2 options'
      })
    }

    const hasEmptyOption =
      question.options.some(
        (option) =>
          !option.text ||
          !option.text.trim()
      )

    if (hasEmptyOption) {
      return res.status(400).json({
        message:
          'Option text cannot be empty'
      })
    }

    const correctOptions =
      question.options.filter(
        (option) =>
          option.isCorrect === true
      )

    if (correctOptions.length !== 1) {
      return res.status(400).json({
        message:
          'Each question must have exactly one correct option'
      })
    }
  }

  // ========================================
  // Create Quiz
  // ========================================

  const quiz = await Quiz.create({
    title: title.trim(),

    description:
      description?.trim() || '',

    category:
      category?.trim() || 'General',

    difficulty: quizDifficulty,

    durationMinutes: parsedDuration,

    questions,

    createdBy: req.user._id
  })

  res.status(201).json({
    message: 'Quiz created successfully',
    quiz
  })
}

// ==========================================
// POST /api/quizzes/:id/submit
// Submit Quiz
// ==========================================

export async function submitQuiz(req, res) {
  const {
    answers,
    timeTakenSeconds
  } = req.body

  const quiz = await Quiz.findById(
    req.params.id
  )

  if (!quiz) {
    return res.status(404).json({
      message: 'Quiz not found'
    })
  }

  // ========================================
  // Answers Validation
  // ========================================

  if (!Array.isArray(answers)) {
    return res.status(400).json({
      message: 'Answers must be an array'
    })
  }

  if (
    answers.length !==
    quiz.questions.length
  ) {
    return res.status(400).json({
      message: 'Please answer all questions'
    })
  }

  let correctCount = 0

  // ========================================
  // Calculate Correct Answers
  //
  // Frontend sends:
  //
  // answers: [
  //   {
  //     questionId: "...",
  //     selectedOption: 2
  //   }
  // ]
  // ========================================

  quiz.questions.forEach(
    (question, index) => {
      const answer = answers[index]

      const selectedOptionIndex =
        Number(answer?.selectedOption)

      const correctOptionIndex =
        question.options.findIndex(
          (option) =>
            option.isCorrect === true
        )

      if (
        selectedOptionIndex ===
        correctOptionIndex
      ) {
        correctCount++
      }
    }
  )

  const total =
    quiz.questions.length

  const incorrectCount =
    total - correctCount

  const score =
    total > 0
      ? Math.round(
          (correctCount / total) * 100
        )
      : 0

  // ========================================
  // Save Result
  // ========================================

  const result = await Result.create({
    user: req.user._id,

    quiz: quiz._id,

    score,

    total,

    correctCount,

    incorrectCount,

    timeTakenSeconds:
      typeof timeTakenSeconds === 'number'
        ? timeTakenSeconds
        : null
  })

  res.status(201).json({
    message:
      'Quiz submitted successfully',

    result
  })
}

// ==========================================
// GET /api/quizzes/:id/leaderboard
// Get Quiz Leaderboard
// ==========================================

export async function getLeaderboard(
  req,
  res
) {
  const quiz = await Quiz.findById(
    req.params.id
  )

  if (!quiz) {
    return res.status(404).json({
      message: 'Quiz not found'
    })
  }

  const results = await Result.find({
    quiz: req.params.id
  })
    .populate(
      'user',
      'name email'
    )
    .sort({
      score: -1,
      timeTakenSeconds: 1,
      createdAt: 1
    })
    .limit(20)

  res.status(200).json({
    quiz: {
      id: quiz._id,
      title: quiz.title,
      category:
        quiz.category || 'General',
      difficulty:
        quiz.difficulty || 'Easy'
    },

    leaderboard: results
  })
}

// ==========================================
// PUT /api/quizzes/:id
// Update Quiz - Admin Only
// ==========================================

export async function updateQuiz(req, res) {
  const quiz = await Quiz.findById(
    req.params.id
  )

  if (!quiz) {
    return res.status(404).json({
      message: 'Quiz not found'
    })
  }

  const {
    title,
    description,
    category,
    difficulty,
    durationMinutes,
    questions
  } = req.body

  // ========================================
  // Title Validation
  // ========================================

  if (!title || !title.trim()) {
    return res.status(400).json({
      message: 'Quiz title is required'
    })
  }

  // ========================================
  // Questions Validation
  // ========================================

  if (
    !Array.isArray(questions) ||
    questions.length === 0
  ) {
    return res.status(400).json({
      message:
        'At least one question is required'
    })
  }

  // ========================================
  // Difficulty Validation
  // ========================================

  const allowedDifficulties = [
    'Easy',
    'Medium',
    'Hard'
  ]

  const quizDifficulty =
    difficulty || 'Easy'

  if (
    !allowedDifficulties.includes(
      quizDifficulty
    )
  ) {
    return res.status(400).json({
      message:
        'Difficulty must be Easy, Medium or Hard'
    })
  }

  // ========================================
  // Duration Validation
  // ========================================

  const parsedDuration =
    durationMinutes === undefined ||
    durationMinutes === null ||
    durationMinutes === ''
      ? 5
      : Number(durationMinutes)

  if (
    !Number.isInteger(parsedDuration) ||
    parsedDuration < 1 ||
    parsedDuration > 120
  ) {
    return res.status(400).json({
      message:
        'Duration must be between 1 and 120 minutes'
    })
  }

  // ========================================
  // Validate Every Question
  // ========================================

  for (const question of questions) {
    if (
      !question.questionText ||
      !question.questionText.trim()
    ) {
      return res.status(400).json({
        message:
          'Question text is required'
      })
    }

    if (
      !Array.isArray(question.options) ||
      question.options.length < 2
    ) {
      return res.status(400).json({
        message:
          'Each question must have at least 2 options'
      })
    }

    const hasEmptyOption =
      question.options.some(
        (option) =>
          !option.text ||
          !option.text.trim()
      )

    if (hasEmptyOption) {
      return res.status(400).json({
        message:
          'Option text cannot be empty'
      })
    }

    const correctOptions =
      question.options.filter(
        (option) =>
          option.isCorrect === true
      )

    if (correctOptions.length !== 1) {
      return res.status(400).json({
        message:
          'Each question must have exactly one correct option'
      })
    }
  }

  // ========================================
  // Update Quiz
  // ========================================

  quiz.title =
    title.trim()

  quiz.description =
    description?.trim() || ''

  quiz.category =
    category?.trim() || 'General'

  quiz.difficulty =
    quizDifficulty

  quiz.durationMinutes =
    parsedDuration

  quiz.questions =
    questions

  const updatedQuiz =
    await quiz.save()

  res.status(200).json({
    message:
      'Quiz updated successfully',

    quiz: updatedQuiz
  })
}

// ==========================================
// DELETE /api/quizzes/:id
// Delete Quiz - Admin Only
// ==========================================

export async function deleteQuiz(req, res) {
  const quiz = await Quiz.findById(
    req.params.id
  )

  if (!quiz) {
    return res.status(404).json({
      message: 'Quiz not found'
    })
  }

  // ========================================
  // Delete results belonging to quiz
  // ========================================

  await Result.deleteMany({
    quiz: quiz._id
  })

  // ========================================
  // Delete Quiz
  // ========================================

  await quiz.deleteOne()

  res.status(200).json({
    message:
      'Quiz deleted successfully'
  })
}