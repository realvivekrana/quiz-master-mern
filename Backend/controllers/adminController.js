import User from '../models/User.js'
import Result from '../models/Result.js'

// ==========================================
// GET /api/admin/users
// Get All Users - Admin Only
// ==========================================

export async function getUsers(req, res) {
  const users = await User.find()
    .select('-password')
    .sort({ createdAt: -1 })

  const usersWithStats = await Promise.all(
    users.map(async (user) => {
      const attempts = await Result.countDocuments({
        user: user._id
      })

      const bestResult = await Result.findOne({
        user: user._id
      })
        .sort({ score: -1 })
        .select('score')

      return {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role || 'user',
        createdAt: user.createdAt,
        attempts,
        bestScore: bestResult?.score ?? null
      }
    })
  )

  res.status(200).json({
    count: usersWithStats.length,
    users: usersWithStats
  })
}

// ==========================================
// PATCH /api/admin/users/:id/role
// Change User Role - Admin Only
// ==========================================

export async function updateUserRole(req, res) {
  const { role } = req.body

  if (!['user', 'admin'].includes(role)) {
    return res.status(400).json({
      message: 'Role must be user or admin'
    })
  }

  const user = await User.findById(req.params.id)

  if (!user) {
    return res.status(404).json({
      message: 'User not found'
    })
  }

  // Admin apna khud ka role accidentally remove na kare
  if (
    user._id.toString() === req.user._id.toString() &&
    role !== 'admin'
  ) {
    return res.status(400).json({
      message: 'You cannot remove your own admin role'
    })
  }

  user.role = role

  await user.save()

  res.status(200).json({
    message: 'User role updated successfully',

    user: {
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role
    }
  })
}