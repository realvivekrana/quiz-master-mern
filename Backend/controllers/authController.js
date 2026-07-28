import User from '../models/User.js'
import generateToken from '../utils/generateToken.js'

// POST /api/auth/register
export async function register(req, res) {
  const { name, email, password } = req.body

  if (!name || !email || !password) {
    return res.status(400).json({ message: 'Name, email and password are required' })
  }
  if (password.length < 6) {
    return res.status(400).json({ message: 'Password must be at least 6 characters' })
  }

  const existing = await User.findOne({ email: email.toLowerCase() })
  if (existing) {
    return res.status(409).json({ message: 'An account with this email already exists' })
  }

  const user = await User.create({ name, email, password })

  res.status(201).json({
    token: generateToken(user._id),
    user: { id: user._id, name: user.name, email: user.email }
  })
}

// POST /api/auth/login
export async function login(req, res) {
  const { email, password } = req.body

  if (!email || !password) {
    return res.status(400).json({ message: 'Email and password are required' })
  }

  const user = await User.findOne({ email: email.toLowerCase() })
  if (!user || !(await user.comparePassword(password))) {
    return res.status(401).json({ message: 'Invalid email or password' })
  }

  res.json({
    token: generateToken(user._id),
    user: { id: user._id, name: user.name, email: user.email }
  })
}

// GET /api/auth/me
export async function getMe(req, res) {
  res.json({ user: req.user })
}