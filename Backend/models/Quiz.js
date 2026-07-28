import mongoose from 'mongoose'

const questionSchema = new mongoose.Schema({
  text: { type: String, required: true },
  options: {
    type: [String],
    required: true,
    validate: (arr) => arr.length >= 2
  },
  correctOption: { type: Number, required: true } // index into options[]
})

const quizSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    description: { type: String, default: '' },
    category: { type: String, default: 'General' },
    durationMinutes: { type: Number, default: 5 },
    questions: {
      type: [questionSchema],
      required: true,
      validate: (arr) => arr.length > 0
    },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
  },
  { timestamps: true }
)

export default mongoose.model('Quiz', quizSchema)