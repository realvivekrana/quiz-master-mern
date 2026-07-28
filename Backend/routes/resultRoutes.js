import express from 'express'

import {
  getMyResults
} from '../controllers/resultController.js'

import protect from '../middleware/auth.js'
import asyncHandler from '../utils/asyncHandler.js'

const router = express.Router()

// ==========================================
// GET MY RESULTS
// GET /api/results/me
// ==========================================

router.get(
  '/me',
  protect,
  asyncHandler(getMyResults)
)

export default router