import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'

import connectDB from './config/db.js'

// ==========================================
// ROUTES
// ==========================================

import authRoutes from './routes/authRoutes.js'
import quizRoutes from './routes/quizRoutes.js'
import resultRoutes from './routes/resultRoutes.js'
import adminRoutes from './routes/adminRoutes.js'

// ==========================================
// ENV CONFIG
// ==========================================

dotenv.config()

// ==========================================
// EXPRESS APP
// ==========================================

const app = express()

// ==========================================
// MIDDLEWARE
// ==========================================

app.use(cors())

app.use(express.json())

app.use(
  express.urlencoded({
    extended: true
  })
)

// ==========================================
// HEALTH CHECK
// ==========================================

app.get('/', (req, res) => {
  res.status(200).json({
    status: 'ok',
    message: 'Quiz Master API is running'
  })
})

// ==========================================
// API ROUTES
// ==========================================

// Authentication
app.use('/api/auth', authRoutes)

// Quizzes
app.use('/api/quizzes', quizRoutes)

// Results / Quiz History
app.use('/api/results', resultRoutes)

// Admin
app.use('/api/admin', adminRoutes)

// ==========================================
// 404 HANDLER
// ==========================================

app.use((req, res) => {
  res.status(404).json({
    message: `Route not found: ${req.method} ${req.originalUrl}`
  })
})

// ==========================================
// GLOBAL ERROR HANDLER
// ==========================================

app.use((err, req, res, next) => {
  console.error('Server error:', err)

  // Invalid MongoDB ObjectId
  if (err.name === 'CastError') {
    return res.status(400).json({
      message: 'Invalid ID'
    })
  }

  // Duplicate MongoDB value
  if (err.code === 11000) {
    return res.status(400).json({
      message: 'Duplicate value already exists'
    })
  }

  // Mongoose validation error
  if (err.name === 'ValidationError') {
    const messages = Object.values(
      err.errors
    ).map((error) => error.message)

    return res.status(400).json({
      message: messages.join(', ')
    })
  }

  // Default server error
  res.status(err.statusCode || 500).json({
    message:
      err.message ||
      'Internal server error'
  })
})

// ==========================================
// PORT
// ==========================================

const PORT = process.env.PORT || 5000

// ==========================================
// START SERVER
// MongoDB first -> Express second
// ==========================================

async function startServer() {
  try {
    await connectDB()

    app.listen(PORT, () => {
      console.log(
        `Quiz Master API running on port ${PORT}`
      )
    })
  } catch (error) {
    console.error(
      `Failed to start server: ${error.message}`
    )

    process.exit(1)
  }
}

startServer()