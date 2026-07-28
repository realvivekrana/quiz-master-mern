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
        validator: function (options) {
          return options.length >= 2
        },
        message: 'Each question must have at least 2 options'
      }
    }
  }
)

const quizSchema = new mongoose.Schema(
  {
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

    questions: {
      type: [questionSchema],
      default: []
    },

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

export default mongoose.model('Quiz', quizSchema)