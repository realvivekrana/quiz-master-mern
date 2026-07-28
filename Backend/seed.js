import dotenv from 'dotenv'
import connectDB from './config/db.js'
import Quiz from './models/Quiz.js'

dotenv.config()

const sampleQuizzes = [
  {
    title: 'General Knowledge Sprint',
    description: 'Quick-fire questions to test your all-round trivia.',
    category: 'General',
    durationMinutes: 3,
    questions: [
      {
        text: 'What is the capital of France?',
        options: ['Berlin', 'Madrid', 'Paris', 'Rome'],
        correctOption: 2
      },
      {
        text: 'Which planet is known as the Red Planet?',
        options: ['Venus', 'Mars', 'Jupiter', 'Saturn'],
        correctOption: 1
      },
      {
        text: 'How many continents are there on Earth?',
        options: ['5', '6', '7', '8'],
        correctOption: 2
      }
    ]
  },
  {
    title: 'JavaScript Basics',
    description: 'For anyone learning MERN stack fundamentals.',
    category: 'Programming',
    durationMinutes: 5,
    questions: [
      {
        text: 'Which keyword declares a block-scoped variable in JS?',
        options: ['var', 'let', 'global', 'define'],
        correctOption: 1
      },
      {
        text: 'What does MERN stand for?',
        options: [
          'MongoDB, Express, React, Node',
          'MySQL, Express, React, Node',
          'MongoDB, Ember, React, Nginx',
          'MongoDB, Express, Ruby, Node'
        ],
        correctOption: 0
      },
      {
        text: 'Which method converts a JSON string into a JS object?',
        options: ['JSON.stringify()', 'JSON.parse()', 'JSON.toObject()', 'Object.parse()'],
        correctOption: 1
      }
    ]
  }
]

async function seed() {
  await connectDB()
  await Quiz.deleteMany()
  await Quiz.insertMany(sampleQuizzes)
  console.log('Sample quizzes inserted')
  process.exit(0)
}

seed()