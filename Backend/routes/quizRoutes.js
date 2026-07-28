import express from 'express'

import {
  getQuizzes,
  getQuizById,
  submitQuiz,
  createQuiz,
  getLeaderboard,
  updateQuiz,
  deleteQuiz
} from '../controllers/quizController.js'

import protect from '../middleware/auth.js'
import admin from '../middleware/admin.js'
import asyncHandler from '../utils/asyncHandler.js'

const router = express.Router()

// ==========================================
// GET ALL QUIZZES
// Logged-in users
// ==========================================

router.get(
  '/',
  protect,
  asyncHandler(getQuizzes)
)

// ==========================================
// CREATE QUIZ
// Admin only
// ==========================================

router.post(
  '/',
  protect,
  admin,
  asyncHandler(createQuiz)
)

// ==========================================
// LEADERBOARD
// Logged-in users
// ==========================================

router.get(
  '/:id/leaderboard',
  protect,
  asyncHandler(getLeaderboard)
)

// ==========================================
// SUBMIT QUIZ
// Logged-in users
// ==========================================

router.post(
  '/:id/submit',
  protect,
  asyncHandler(submitQuiz)
)

// ==========================================
// GET SINGLE QUIZ
// Logged-in users
// ==========================================

router.get(
  '/:id',
  protect,
  asyncHandler(getQuizById)
)

// ==========================================
// UPDATE QUIZ
// Admin only
// ==========================================

router.put(
  '/:id',
  protect,
  admin,
  asyncHandler(updateQuiz)
)

// ==========================================
// DELETE QUIZ
// Admin only
// ==========================================

router.delete(
  '/:id',
  protect,
  admin,
  asyncHandler(deleteQuiz)
)

export default router