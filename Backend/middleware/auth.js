import jwt from 'jsonwebtoken'
import User from '../models/User.js'

// ==========================================
// Protect Middleware
// Logged-in user ko verify karta hai
// ==========================================

export default async function protect(req, res, next) {
  try {
    let token

    // Authorization header:
    // Bearer eyJhbGciOiJIUzI1NiIs...

    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith('Bearer ')
    ) {
      token = req.headers.authorization.split(' ')[1]
    }

    // Token nahi mila
    if (!token) {
      return res.status(401).json({
        message: 'Not authorized, token missing'
      })
    }

    // JWT verify
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET
    )

    // User find karo
    // Password ko response/request object me nahi rakhenge
    const user = await User.findById(decoded.id)
      .select('-password')

    if (!user) {
      return res.status(401).json({
        message: 'Not authorized, user not found'
      })
    }

    // Purane users ke document me role missing ho sakta hai
    // unko normal user treat karenge
    if (!user.role) {
      user.role = 'user'
    }

    // Important:
    // admin middleware isi req.user ko check karega
    req.user = user

    next()
  } catch (error) {
    console.error('Auth middleware error:', error.message)

    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({
        message: 'Token expired, please login again'
      })
    }

    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({
        message: 'Invalid token'
      })
    }

    return res.status(401).json({
      message: 'Not authorized'
    })
  }
}