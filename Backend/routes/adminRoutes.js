import express from 'express'

import {
  getUsers,
  updateUserRole
} from '../controllers/adminController.js'

import protect from '../middleware/auth.js'
import admin from '../middleware/admin.js'
import asyncHandler from '../utils/asyncHandler.js'

const router = express.Router()

// ==========================================
// ALL ROUTES BELOW REQUIRE:
// Login + Admin
// ==========================================

router.use(protect)
router.use(admin)

// ==========================================
// GET ALL USERS
// GET /api/admin/users
// ==========================================

router.get(
  '/users',
  asyncHandler(getUsers)
)

// ==========================================
// UPDATE USER ROLE
// PATCH /api/admin/users/:id/role
// ==========================================

router.patch(
  '/users/:id/role',
  asyncHandler(updateUserRole)
)

export default router