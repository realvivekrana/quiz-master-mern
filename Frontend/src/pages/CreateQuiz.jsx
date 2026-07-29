import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'

import api from '../api/axios'

const createEmptyQuestion = () => ({
  questionText: '',
  options: ['', '', '', ''],
  correctAnswer: 0
})

export default function CreateQuiz() {
  const navigate = useNavigate()

  const [form, setForm] = useState({
    title: '',
    description: '',
    category: '',
    difficulty: 'Easy',
    durationMinutes: 5,
    questions: [createEmptyQuestion()]
  })

  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  // ==========================================
  // QUIZ FIELD CHANGE
  // ==========================================

  function handleChange(event) {
    const { name, value } = event.target

    setForm((current) => ({
      ...current,
      [name]:
        name === 'durationMinutes'
          ? Number(value)
          : value
    }))
  }

  // ==========================================
  // QUESTION CHANGE
  // ==========================================

  function handleQuestionChange(
    questionIndex,
    value
  ) {
    setForm((current) => {
      const questions =
        current.questions.map(
          (question, index) =>
            index === questionIndex
              ? {
                  ...question,
                  questionText: value
                }
              : question
        )

      return {
        ...current,
        questions
      }
    })
  }

  // ==========================================
  // OPTION CHANGE
  // ==========================================

  function handleOptionChange(
    questionIndex,
    optionIndex,
    value
  ) {
    setForm((current) => {
      const questions =
        current.questions.map(
          (question, index) => {
            if (index !== questionIndex) {
              return question
            }

            const options =
              question.options.map(
                (option, currentOptionIndex) =>
                  currentOptionIndex ===
                  optionIndex
                    ? value
                    : option
              )

            return {
              ...question,
              options
            }
          }
        )

      return {
        ...current,
        questions
      }
    })
  }

  // ==========================================
  // CORRECT ANSWER
  // ==========================================

  function handleCorrectAnswer(
    questionIndex,
    optionIndex
  ) {
    setForm((current) => ({
      ...current,

      questions:
        current.questions.map(
          (question, index) =>
            index === questionIndex
              ? {
                  ...question,
                  correctAnswer:
                    optionIndex
                }
              : question
        )
    }))
  }

  // ==========================================
  // ADD QUESTION
  // ==========================================

  function addQuestion() {
    setForm((current) => ({
      ...current,

      questions: [
        ...current.questions,
        createEmptyQuestion()
      ]
    }))
  }

  // ==========================================
  // REMOVE QUESTION
  // ==========================================

  function removeQuestion(indexToRemove) {
    if (form.questions.length === 1) {
      return
    }

    setForm((current) => ({
      ...current,

      questions:
        current.questions.filter(
          (_, index) =>
            index !== indexToRemove
        )
    }))
  }

  // ==========================================
  // VALIDATION
  // ==========================================

  function validateForm() {
    if (!form.title.trim()) {
      return 'Quiz title is required.'
    }

    if (!form.category.trim()) {
      return 'Quiz category is required.'
    }

    if (
      !form.durationMinutes ||
      form.durationMinutes < 1
    ) {
      return 'Duration must be at least 1 minute.'
    }

    if (form.questions.length === 0) {
      return 'Add at least one question.'
    }

    for (
      let index = 0;
      index < form.questions.length;
      index++
    ) {
      const question =
        form.questions[index]

      if (!question.questionText.trim()) {
        return `Question ${
          index + 1
        } is required.`
      }

      const hasEmptyOption =
        question.options.some(
          (option) =>
            !option.trim()
        )

      if (hasEmptyOption) {
        return `Fill all options for question ${
          index + 1
        }.`
      }
    }

    return ''
  }

  // ==========================================
  // SUBMIT
  // ==========================================

  async function handleSubmit(event) {
    event.preventDefault()

    const validationError =
      validateForm()

    if (validationError) {
      setError(validationError)
      return
    }

    try {
      setLoading(true)
      setError('')

      const payload = {
        ...form,

        title: form.title.trim(),

        description:
          form.description.trim(),

        category:
          form.category.trim(),

        durationMinutes:
          Number(form.durationMinutes),

        questions:
          form.questions.map(
            (question) => ({
              questionText:
                question.questionText.trim(),

              options:
                question.options.map(
                  (option) =>
                    option.trim()
                ),

              correctAnswer:
                question.correctAnswer
            })
          )
      }

      await api.post(
        '/quizzes',
        payload
      )

      navigate('/admin')
    } catch (err) {
      console.error(
        'Create quiz error:',
        err
      )

      setError(
        err.response?.data?.message ||
          'Could not create quiz.'
      )
    } finally {
      setLoading(false)
    }
  }

  // ==========================================
  // PAGE
  // ==========================================

  return (
    <main className="page">
      <div
        className="container"
        style={{
          maxWidth: 900
        }}
      >
        {/* HEADER */}

        <div className="create-quiz-header">
          <div>
            <span className="eyebrow">
              Admin panel
            </span>

            <h1
              style={{
                marginTop: 7,
                marginBottom: 8,
                fontSize:
                  'clamp(28px, 8vw, 40px)'
              }}
            >
              Create Quiz
            </h1>

            <p
              style={{
                margin: 0,
                maxWidth: 600,
                color: 'var(--muted)',
                lineHeight: 1.6
              }}
            >
              Create a new quiz, add
              questions and choose the
              correct answer for each one.
            </p>
          </div>

          <Link
            to="/admin"
            className="btn btn-ghost"
          >
            ← Admin Panel
          </Link>
        </div>

        {/* ERROR */}

        {error && (
          <div
            role="alert"
            style={{
              marginBottom: 20,
              padding: '12px 14px',
              border:
                '1px solid rgba(232, 85, 63, 0.4)',
              borderRadius: 10,
              background:
                'rgba(232, 85, 63, 0.08)'
            }}
          >
            <p
              className="error-text"
              style={{
                margin: 0
              }}
            >
              {error}
            </p>
          </div>
        )}

        <form
          onSubmit={handleSubmit}
          className="create-quiz-form"
        >
          {/* ==================================
              QUIZ DETAILS
          =================================== */}

          <section className="card">
            <span className="eyebrow">
              Quiz details
            </span>

            <h2
              style={{
                marginTop: 6,
                marginBottom: 22
              }}
            >
              Basic Information
            </h2>

            <div className="create-quiz-fields">
              {/* TITLE */}

              <div className="form-group create-quiz-full-field">
                <label htmlFor="quiz-title">
                  Quiz Title
                </label>

                <input
                  id="quiz-title"
                  type="text"
                  name="title"
                  value={form.title}
                  onChange={handleChange}
                  placeholder="JavaScript Basics"
                  required
                />
              </div>

              {/* DESCRIPTION */}

              <div className="form-group create-quiz-full-field">
                <label htmlFor="quiz-description">
                  Description
                </label>

                <textarea
                  id="quiz-description"
                  name="description"
                  value={form.description}
                  onChange={handleChange}
                  placeholder="Test your JavaScript knowledge..."
                  rows={4}
                />
              </div>

              {/* CATEGORY */}

              <div className="form-group">
                <label htmlFor="quiz-category">
                  Category
                </label>

                <input
                  id="quiz-category"
                  type="text"
                  name="category"
                  value={form.category}
                  onChange={handleChange}
                  placeholder="Programming"
                  required
                />
              </div>

              {/* DIFFICULTY */}

              <div className="form-group">
                <label htmlFor="quiz-difficulty">
                  Difficulty
                </label>

                <select
                  id="quiz-difficulty"
                  name="difficulty"
                  value={form.difficulty}
                  onChange={handleChange}
                >
                  <option value="Easy">
                    Easy
                  </option>

                  <option value="Medium">
                    Medium
                  </option>

                  <option value="Hard">
                    Hard
                  </option>
                </select>
              </div>

              {/* DURATION */}

              <div className="form-group">
                <label htmlFor="quiz-duration">
                  Duration (minutes)
                </label>

                <input
                  id="quiz-duration"
                  type="number"
                  name="durationMinutes"
                  min="1"
                  value={
                    form.durationMinutes
                  }
                  onChange={handleChange}
                  required
                />
              </div>
            </div>
          </section>

          {/* ==================================
              QUESTIONS HEADER
          =================================== */}

          <div className="create-question-header">
            <div>
              <span className="eyebrow">
                Questions
              </span>

              <h2
                style={{
                  marginTop: 5,
                  marginBottom: 0
                }}
              >
                Quiz Questions
              </h2>
            </div>

            <span className="pill">
              {form.questions.length}{' '}
              {form.questions.length === 1
                ? 'question'
                : 'questions'}
            </span>
          </div>

          {/* ==================================
              QUESTIONS
          =================================== */}

          <div className="create-question-list">
            {form.questions.map(
              (question, questionIndex) => (
                <QuestionCard
                  key={questionIndex}
                  question={question}
                  questionIndex={
                    questionIndex
                  }
                  totalQuestions={
                    form.questions.length
                  }
                  onQuestionChange={
                    handleQuestionChange
                  }
                  onOptionChange={
                    handleOptionChange
                  }
                  onCorrectAnswer={
                    handleCorrectAnswer
                  }
                  onRemove={
                    removeQuestion
                  }
                />
              )
            )}
          </div>

          {/* ADD QUESTION */}

          <button
            type="button"
            className="btn btn-ghost create-add-question"
            onClick={addQuestion}
          >
            + Add Another Question
          </button>

          {/* ==================================
              FORM ACTIONS
          =================================== */}

          <div className="create-quiz-actions">
            <Link
              to="/admin"
              className="btn btn-ghost"
            >
              Cancel
            </Link>

            <button
              type="submit"
              className="btn btn-primary"
              disabled={loading}
            >
              {loading
                ? 'Creating...'
                : 'Create Quiz'}
            </button>
          </div>
        </form>
      </div>
    </main>
  )
}

// ==========================================
// QUESTION CARD
// ==========================================

function QuestionCard({
  question,
  questionIndex,
  totalQuestions,
  onQuestionChange,
  onOptionChange,
  onCorrectAnswer,
  onRemove
}) {
  return (
    <section className="card create-question-card">
      {/* HEADER */}

      <div className="question-card-header">
        <div>
          <span className="eyebrow">
            Question
          </span>

          <h3
            style={{
              marginTop: 5,
              marginBottom: 0
            }}
          >
            Question {questionIndex + 1}
          </h3>
        </div>

        {totalQuestions > 1 && (
          <button
            type="button"
            className="btn btn-ghost question-remove-button"
            onClick={() =>
              onRemove(questionIndex)
            }
          >
            Remove
          </button>
        )}
      </div>

      {/* QUESTION TEXT */}

      <div className="form-group">
        <label
          htmlFor={`question-${questionIndex}`}
        >
          Question Text
        </label>

        <textarea
          id={`question-${questionIndex}`}
          value={question.questionText}
          onChange={(event) =>
            onQuestionChange(
              questionIndex,
              event.target.value
            )
          }
          placeholder="Enter your question..."
          rows={3}
          required
        />
      </div>

      {/* OPTIONS */}

      <div
        style={{
          marginTop: 22
        }}
      >
        <div
          style={{
            display: 'flex',
            justifyContent:
              'space-between',
            gap: 12,
            flexWrap: 'wrap',
            marginBottom: 12
          }}
        >
          <div>
            <span className="eyebrow">
              Answer options
            </span>

            <p
              style={{
                margin: '5px 0 0',
                color: 'var(--muted)',
                fontSize: 12
              }}
            >
              Select the correct answer.
            </p>
          </div>
        </div>

        <div className="question-options-grid">
          {question.options.map(
            (option, optionIndex) => {
              const isCorrect =
                question.correctAnswer ===
                optionIndex

              return (
                <label
                  key={optionIndex}
                  className={`question-option-editor ${
                    isCorrect
                      ? 'question-option-correct'
                      : ''
                  }`}
                >
                  <div className="question-option-radio">
                    <input
                      type="radio"
                      name={`correct-${questionIndex}`}
                      checked={isCorrect}
                      onChange={() =>
                        onCorrectAnswer(
                          questionIndex,
                          optionIndex
                        )
                      }
                    />

                    <span>
                      {String.fromCharCode(
                        65 + optionIndex
                      )}
                    </span>
                  </div>

                  <input
                    type="text"
                    value={option}
                    onChange={(event) =>
                      onOptionChange(
                        questionIndex,
                        optionIndex,
                        event.target.value
                      )
                    }
                    placeholder={`Option ${
                      optionIndex + 1
                    }`}
                    required
                  />
                </label>
              )
            }
          )}
        </div>
      </div>
    </section>
  )
}