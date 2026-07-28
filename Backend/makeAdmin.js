import dotenv from 'dotenv'
import mongoose from 'mongoose'
import dns from 'dns'
import User from './models/User.js'

// Load .env
dotenv.config()

// ==========================================
// DNS FIX
// Node SRV lookup ke liye Google DNS
// ==========================================

dns.setServers([
  '8.8.8.8',
  '8.8.4.4'
])

// ==========================================
// MAKE ADMIN
// ==========================================

async function makeAdmin() {
  try {
    console.log('Connecting to MongoDB...')

    await mongoose.connect(process.env.MONGO_URI)

    console.log('MongoDB connected')

    // IMPORTANT:
    // Yahan wahi email likho jisse website me login karte ho
    const email = 'vivek@gmail.com'

    const user = await User.findOne({
      email: email.trim().toLowerCase()
    })

    if (!user) {
      console.log(`User not found: ${email}`)
      return
    }

    user.role = 'admin'

    await user.save()

    console.log('')
    console.log('==============================')
    console.log('Admin created successfully')
    console.log('==============================')
    console.log('Name:', user.name)
    console.log('Email:', user.email)
    console.log('Role:', user.role)
    console.log('==============================')
  } catch (error) {
    console.error('')
    console.error('Error:', error.message)
  } finally {
    await mongoose.connection.close()
  }
}

makeAdmin()