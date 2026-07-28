import User from '../models/User.js'
import generateToken from '../utils/generateToken.js'

// ==========================================
// POST /api/auth/register
// ==========================================

export async function register(req, res) {
  const { name, email, password } = req.body

  if (!name || !email || !password) {
    return res.status(400).json({
      message: 'Name, email and password are required'
    })
  }

  if (password.length < 6) {
    return res.status(400).json({
      message: 'Password must be at least 6 characters'
    })
  }

  const normalizedEmail = email
    .trim()
    .toLowerCase()

  const existing = await User.findOne({
    email: normalizedEmail
  })

  if (existing) {
    return res.status(409).json({
      message: 'An account with this email already exists'
    })
  }

  // Registration se role accept nahi kar rahe.
  // Har normal registration "user" hi hogi.
  const user = await User.create({
    name: name.trim(),
    email: normalizedEmail,
    password,
    role: 'user'
  })

  res.status(201).json({
    token: generateToken(user._id),

    user: {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role
    }
  })
}

// ==========================================
// POST /api/auth/login
// ==========================================

export async function login(req, res) {
  const { email, password } = req.body

  if (!email || !password) {
    return res.status(400).json({
      message: 'Email and password are required'
    })
  }

  const normalizedEmail = email
    .trim()
    .toLowerCase()

  const user = await User.findOne({
    email: normalizedEmail
  })

  if (
    !user ||
    !(await user.comparePassword(password))
  ) {
    return res.status(401).json({
      message: 'Invalid email or password'
    })
  }

  res.status(200).json({
    token: generateToken(user._id),

    user: {
      id: user._id,
      name: user.name,
      email: user.email,

      // Purana account hai aur role missing hai
      // to normal user maana jayega.
      role: user.role || 'user'
    }
  })
}

// ==========================================
// GET /api/auth/me
// ==========================================

export async function getMe(req, res) {
  res.status(200).json({
    user: {
      id: req.user._id,
      name: req.user.name,
      email: req.user.email,
      role: req.user.role || 'user'
    }
  })
}