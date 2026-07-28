import mongoose from 'mongoose'
import dns from 'node:dns'

// Node ko reliable DNS servers explicitly use karwa rahe hain
dns.setServers([
  '8.8.8.8',
  '8.8.4.4',
  '1.1.1.1'
])

export default async function connectDB() {
  try {
    if (!process.env.MONGO_URI) {
      throw new Error('MONGO_URI is missing from .env')
    }

    console.log('Connecting to MongoDB...')

    const conn = await mongoose.connect(
      process.env.MONGO_URI,
      {
        serverSelectionTimeoutMS: 10000
      }
    )

    console.log(
      `MongoDB connected: ${conn.connection.host}`
    )
  } catch (err) {
    console.error(
      `MongoDB connection error: ${err.message}`
    )

    process.exit(1)
  }
}