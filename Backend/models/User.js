import mongoose from 'mongoose'
import bcrypt from 'bcryptjs'

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true
    },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true
    },

    password: {
      type: String,
      required: true,
      minlength: 6
    },

    role: {
      type: String,
      enum: ['user', 'admin'],
      default: 'user'
    }
  },
  {
    timestamps: true
  }
)

// ==========================================
// HASH PASSWORD BEFORE SAVE
// ==========================================

userSchema.pre('save', async function () {
  // Password change nahi hua to kuch mat karo
  if (!this.isModified('password')) {
    return
  }

  const salt = await bcrypt.genSalt(10)

  this.password = await bcrypt.hash(
    this.password,
    salt
  )
})

// ==========================================
// COMPARE LOGIN PASSWORD
// ==========================================

userSchema.methods.comparePassword =
  function (candidatePassword) {
    return bcrypt.compare(
      candidatePassword,
      this.password
    )
  }

export default mongoose.model(
  'User',
  userSchema
)