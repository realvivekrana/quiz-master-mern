import express from 'express'
import { register, login, getMe } from '../controllers/authController.js'
import protect from '../middleware/auth.js'
import asyncHandler from '../utils/asyncHandler.js'

const router = express.Router()

router.post('/register', asyncHandler(register))
router.post('/login', asyncHandler(login))
router.get('/me', protect, asyncHandler(getMe))

export default router