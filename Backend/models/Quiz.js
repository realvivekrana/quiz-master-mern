import mongoose from 'mongoose'

const optionSchema = new mongoose.Schema(
  {
    text: {
      type: String,
      required: true,
      trim: true
    },

    isCorrect: {
      type: Boolean,
      default: false
    }
  },
  {
    _id: false
  }
)

const questionSchema = new mongoose.Schema(
  {
    questionText: {
      type: String,
      required: true,
      trim: true
    },

    options: {
      type: [optionSchema],
      required: true,

      validate: {
        validator(options) {
          return options.length >= 2
        },

        message: 'Each question must have at least 2 options'
      }
    }
  }
)

const quizSchema = new mongoose.Schema(
  {
    // ==========================================
    // Basic Information
    // ==========================================

    title: {
      type: String,
      required: true,
      trim: true
    },

    description: {
      type: String,
      trim: true,
      default: ''
    },

    // ==========================================
    // Category
    // ==========================================

    category: {
      type: String,
      required: true,
      trim: true,
      default: 'General'
    },

    // ==========================================
    // Difficulty
    // ==========================================

    difficulty: {
      type: String,

      enum: [
        'Easy',
        'Medium',
        'Hard'
      ],

      default: 'Easy'
    },

    // ==========================================
    // Quiz Duration
    // ==========================================

    durationMinutes: {
      type: Number,
      min: 1,
      max: 120,
      default: 5
    },

    // ==========================================
    // Questions
    // ==========================================

    questions: {
      type: [questionSchema],
      default: []
    },

    // ==========================================
    // Creator
    // ==========================================

    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    }
  },
  {
    timestamps: true
  }
)

export default mongoose.model(
  'Quiz',
  quizSchema
)