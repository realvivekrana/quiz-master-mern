import express from 'express'
import {
  getQuizzes,
  getQuizById,
  submitQuiz,
  createQuiz,
  getLeaderboard
} from '../controllers/quizController.js'
import protect from '../middleware/auth.js'
import asyncHandler from '../utils/asyncHandler.js'

const router = express.Router()

router.get('/', protect, asyncHandler(getQuizzes))
router.post('/', protect, asyncHandler(createQuiz))
router.get('/:id', protect, asyncHandler(getQuizById))
router.post('/:id/submit', protect, asyncHandler(submitQuiz))
router.get('/:id/leaderboard', protect, asyncHandler(getLeaderboard))

export default router