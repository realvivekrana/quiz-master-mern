import { useEffect, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'

import api from '../api/axios'

const createEmptyQuestion = () => ({
  questionText: '',
  options: ['', '', '', ''],
  correctAnswer: 0
})

export default function EditQuiz() {
  const { id } = useParams()
  const navigate = useNavigate()

  const [form, setForm] = useState({
    title: '',
    description: '',
    category: '',
    difficulty: 'Easy',
    durationMinutes: 5,
    questions: []
  })

  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  // ==========================================
  // LOAD EXISTING QUIZ
  // ==========================================

  useEffect(() => {
    async function fetchQuiz() {
      try {
        setLoading(true)
        setError('')

        const { data } = await api.get(
          `/quizzes/${id}`
        )

        const quiz = data.quiz || data

        setForm({
          title: quiz.title || '',
          description: quiz.description || '',
          category: quiz.category || '',
          difficulty:
            quiz.difficulty || 'Easy',
          durationMinutes:
            Number(quiz.durationMinutes) || 5,

          questions:
            quiz.questions?.length > 0
              ? quiz.questions.map(
                  (question) => ({
                    _id: question._id,

                    questionText:
                      question.questionText ||
                      question.question ||
                      '',

                    options:
                      normaliseOptions(
                        question.options
                      ),

                    correctAnswer:
                      getCorrectAnswer(
                        question
                      )
                  })
                )
              : [createEmptyQuestion()]
        })
      } catch (err) {
        console.error(
          'Load quiz error:',
          err
        )

        setError(
          err.response?.data?.message ||
            'Could not load quiz.'
        )
      } finally {
        setLoading(false)
      }
    }

    fetchQuiz()
  }, [id])

  // ==========================================
  // BASIC FIELD CHANGE
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
    setForm((current) => ({
      ...current,

      questions:
        current.questions.map(
          (question, index) =>
            index === questionIndex
              ? {
                  ...question,
                  questionText: value
                }
              : question
        )
    }))
  }

  // ==========================================
  // OPTION CHANGE
  // ==========================================

  function handleOptionChange(
    questionIndex,
    optionIndex,
    value
  ) {
    setForm((current) => ({
      ...current,

      questions:
        current.questions.map(
          (question, index) => {
            if (index !== questionIndex) {
              return question
            }

            return {
              ...question,

              options:
                question.options.map(
                  (
                    option,
                    currentOptionIndex
                  ) =>
                    currentOptionIndex ===
                    optionIndex
                      ? value
                      : option
                )
            }
          }
        )
    }))
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
    if (form.questions.length <= 1) {
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
      return 'Quiz must contain at least one question.'
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

      if (
        question.options.some(
          (option) =>
            !String(option).trim()
        )
      ) {
        return `Fill all options for question ${
          index + 1
        }.`
      }

      if (
        question.correctAnswer < 0 ||
        question.correctAnswer >=
          question.options.length
      ) {
        return `Select a correct answer for question ${
          index + 1
        }.`
      }
    }

    return ''
  }

  // ==========================================
  // SAVE QUIZ
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
      setSaving(true)
      setError('')

      const payload = {
        title: form.title.trim(),

        description:
          form.description.trim(),

        category:
          form.category.trim(),

        difficulty:
          form.difficulty,

        durationMinutes:
          Number(form.durationMinutes),

        questions:
          form.questions.map(
            (question) => ({
              ...(question._id
                ? {
                    _id: question._id
                  }
                : {}),

              questionText:
                question.questionText.trim(),

              options:
                question.options.map(
                  (option) =>
                    String(option).trim()
                ),

              correctAnswer:
                Number(
                  question.correctAnswer
                )
            })
          )
      }

      await api.put(
        `/quizzes/${id}`,
        payload
      )

      navigate('/admin')
    } catch (err) {
      console.error(
        'Update quiz error:',
        err
      )

      setError(
        err.response?.data?.message ||
          'Could not update quiz.'
      )
    } finally {
      setSaving(false)
    }
  }

  // ==========================================
  // LOADING
  // ==========================================

  if (loading) {
    return (
      <main className="page">
        <div
          className="container"
          style={{
            minHeight: 400,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}
        >
          <div
            style={{
              textAlign: 'center'
            }}
          >
            <div
              className="loader"
              style={{
                margin: '0 auto 14px'
              }}
            />

            <span
              style={{
                color: 'var(--muted)',
                fontFamily:
                  'var(--font-mono)',
                fontSize: 12
              }}
            >
              Loading quiz...
            </span>
          </div>
        </div>
      </main>
    )
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

        <div className="edit-quiz-header">
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
              Edit Quiz
            </h1>

            <p
              style={{
                margin: 0,
                maxWidth: 600,
                color: 'var(--muted)',
                lineHeight: 1.6
              }}
            >
              Update quiz information,
              questions and correct answers.
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
          className="edit-quiz-form"
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

            <div className="edit-quiz-fields">
              {/* TITLE */}

              <div className="form-group edit-quiz-full-field">
                <label htmlFor="edit-title">
                  Quiz Title
                </label>

                <input
                  id="edit-title"
                  type="text"
                  name="title"
                  value={form.title}
                  onChange={handleChange}
                  placeholder="Quiz title"
                  required
                />
              </div>

              {/* DESCRIPTION */}

              <div className="form-group edit-quiz-full-field">
                <label htmlFor="edit-description">
                  Description
                </label>

                <textarea
                  id="edit-description"
                  name="description"
                  value={form.description}
                  onChange={handleChange}
                  placeholder="Quiz description..."
                  rows={4}
                />
              </div>

              {/* CATEGORY */}

              <div className="form-group">
                <label htmlFor="edit-category">
                  Category
                </label>

                <input
                  id="edit-category"
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
                <label htmlFor="edit-difficulty">
                  Difficulty
                </label>

                <select
                  id="edit-difficulty"
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
                <label htmlFor="edit-duration">
                  Duration (minutes)
                </label>

                <input
                  id="edit-duration"
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

          <div className="edit-question-header">
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
                Edit Questions
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

          <div className="edit-question-list">
            {form.questions.map(
              (
                question,
                questionIndex
              ) => (
                <EditQuestionCard
                  key={
                    question._id ||
                    questionIndex
                  }
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
            className="btn btn-ghost edit-add-question"
            onClick={addQuestion}
          >
            + Add Another Question
          </button>

          {/* ==================================
              ACTIONS
          =================================== */}

          <div className="edit-quiz-actions">
            <Link
              to="/admin"
              className="btn btn-ghost"
            >
              Cancel
            </Link>

            <button
              type="submit"
              className="btn btn-primary"
              disabled={saving}
            >
              {saving
                ? 'Saving...'
                : 'Save Changes'}
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

function EditQuestionCard({
  question,
  questionIndex,
  totalQuestions,
  onQuestionChange,
  onOptionChange,
  onCorrectAnswer,
  onRemove
}) {
  return (
    <section className="card edit-question-card">
      <div className="edit-question-card-header">
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
            className="btn btn-ghost edit-question-remove"
            onClick={() =>
              onRemove(questionIndex)
            }
          >
            Remove
          </button>
        )}
      </div>

      {/* QUESTION */}

      <div className="form-group">
        <label
          htmlFor={`edit-question-${questionIndex}`}
        >
          Question Text
        </label>

        <textarea
          id={`edit-question-${questionIndex}`}
          value={question.questionText}
          onChange={(event) =>
            onQuestionChange(
              questionIndex,
              event.target.value
            )
          }
          placeholder="Enter question..."
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
        <span className="eyebrow">
          Answer options
        </span>

        <p
          style={{
            margin: '5px 0 13px',
            color: 'var(--muted)',
            fontSize: 12
          }}
        >
          Select the correct answer.
        </p>

        <div className="edit-options-grid">
          {question.options.map(
            (option, optionIndex) => {
              const isCorrect =
                question.correctAnswer ===
                optionIndex

              return (
                <label
                  key={optionIndex}
                  className={`edit-option ${
                    isCorrect
                      ? 'edit-option-correct'
                      : ''
                  }`}
                >
                  <div className="edit-option-radio">
                    <input
                      type="radio"
                      name={`edit-correct-${questionIndex}`}
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

// ==========================================
// NORMALISE OPTIONS
// ==========================================

function normaliseOptions(options) {
  if (!Array.isArray(options)) {
    return ['', '', '', '']
  }

  const values = options.map(
    (option) => {
      if (typeof option === 'string') {
        return option
      }

      return (
        option?.text ||
        option?.optionText ||
        ''
      )
    }
  )

  while (values.length < 4) {
    values.push('')
  }

  return values.slice(0, 4)
}

// ==========================================
// CORRECT ANSWER
// ==========================================

function getCorrectAnswer(question) {
  if (
    Number.isInteger(
      question.correctAnswer
    )
  ) {
    return question.correctAnswer
  }

  if (
    Number.isInteger(
      question.correctOption
    )
  ) {
    return question.correctOption
  }

  if (
    Number.isInteger(
      question.correctOptionIndex
    )
  ) {
    return question.correctOptionIndex
  }

  return 0
}