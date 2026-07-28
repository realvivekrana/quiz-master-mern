import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import dns from 'dns'

import connectDB from './config/db.js'
import authRoutes from './routes/authRoutes.js'
import quizRoutes from './routes/quizRoutes.js'
import { notFound, errorHandler } from './middleware/errorHandler.js'

// Load environment variables
dotenv.config()

// Fix Node.js DNS resolution for MongoDB Atlas SRV records
dns.setServers(['8.8.8.8', '8.8.4.4'])

const app = express()

// Middleware
app.use(cors({ origin: process.env.CLIENT_URL || '*' }))
app.use(express.json())

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok' })
})

// Routes
app.use('/api/auth', authRoutes)
app.use('/api/quizzes', quizRoutes)

// Error handling
app.use(notFound)
app.use(errorHandler)

const PORT = process.env.PORT || 5000

// Connect MongoDB first, then start the API server
const startServer = async () => {
  try {
    await connectDB()

    app.listen(PORT, () => {
      console.log(`Quiz Master API running on port ${PORT}`)
    })
  } catch (error) {
    console.error(`Server startup error: ${error.message}`)
    process.exit(1)
  }
}

startServer()