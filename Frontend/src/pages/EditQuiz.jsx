import { useEffect, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import api from '../api/axios'

function createEmptyQuestion() {
  return {
    questionText: '',
    options: [
      { text: '', isCorrect: true },
      { text: '', isCorrect: false },
      { text: '', isCorrect: false },
      { text: '', isCorrect: false }
    ]
  }
}

export default function EditQuiz() {
  const { id } = useParams()
  const navigate = useNavigate()

  const [form, setForm] = useState({
    title: '',
    description: '',
    category: '',
    difficulty: 'Easy',
    durationMinutes: 5
  })

  const [questions, setQuestions] = useState([])
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

        const { data } = await api.get(`/quizzes/${id}`)

        // Backend response:
        // {
        //   quiz: {...}
        // }

        const quiz = data.quiz

        if (!quiz) {
          setError('Quiz not found.')
          return
        }

        setForm({
          title: quiz.title || '',
          description: quiz.description || '',
          category: quiz.category || 'General',
          difficulty: quiz.difficulty || 'Easy',
          durationMinutes: quiz.durationMinutes || 5
        })

        setQuestions(
          Array.isArray(quiz.questions)
            ? quiz.questions.map((question) => ({
                questionText: question.questionText || '',
                options: Array.isArray(question.options)
                  ? question.options.map((option) => ({
                      text: option.text || '',
                      isCorrect: option.isCorrect === true
                    }))
                  : []
              }))
            : []
        )
      } catch (err) {
        console.error('Load quiz error:', err)

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
  // BASIC FIELDS
  // ==========================================

  function handleChange(event) {
    const { name, value } = event.target

    setForm((prev) => ({
      ...prev,
      [name]: value
    }))
  }

  // ==========================================
  // QUESTION TEXT
  // ==========================================

  function updateQuestion(questionIndex, value) {
    setQuestions((prev) =>
      prev.map((question, index) =>
        index === questionIndex
          ? {
              ...question,
              questionText: value
            }
          : question
      )
    )
  }

  // ==========================================
  // OPTION TEXT
  // ==========================================

  function updateOption(
    questionIndex,
    optionIndex,
    value
  ) {
    setQuestions((prev) =>
      prev.map((question, qIndex) => {
        if (qIndex !== questionIndex) {
          return question
        }

        return {
          ...question,

          options: question.options.map(
            (option, oIndex) =>
              oIndex === optionIndex
                ? {
                    ...option,
                    text: value
                  }
                : option
          )
        }
      })
    )
  }

  // ==========================================
  // SET CORRECT ANSWER
  // ==========================================

  function setCorrectOption(
    questionIndex,
    optionIndex
  ) {
    setQuestions((prev) =>
      prev.map((question, qIndex) => {
        if (qIndex !== questionIndex) {
          return question
        }

        return {
          ...question,

          options: question.options.map(
            (option, oIndex) => ({
              ...option,
              isCorrect: oIndex === optionIndex
            })
          )
        }
      })
    )
  }

  // ==========================================
  // ADD QUESTION
  // ==========================================

  function addQuestion() {
    setQuestions((prev) => [
      ...prev,
      createEmptyQuestion()
    ])
  }

  // ==========================================
  // REMOVE QUESTION
  // ==========================================

  function removeQuestion(questionIndex) {
    if (questions.length === 1) {
      setError(
        'Quiz must contain at least one question.'
      )
      return
    }

    setError('')

    setQuestions((prev) =>
      prev.filter(
        (_, index) => index !== questionIndex
      )
    )
  }

  // ==========================================
  // VALIDATION
  // ==========================================

  function validateForm() {
    if (!form.title.trim()) {
      return 'Quiz title is required.'
    }

    if (!form.category.trim()) {
      return 'Category is required.'
    }

    const duration = Number(form.durationMinutes)

    if (
      !Number.isInteger(duration) ||
      duration < 1 ||
      duration > 120
    ) {
      return 'Duration must be between 1 and 120 minutes.'
    }

    if (questions.length === 0) {
      return 'At least one question is required.'
    }

    for (
      let questionIndex = 0;
      questionIndex < questions.length;
      questionIndex++
    ) {
      const question = questions[questionIndex]

      if (!question.questionText.trim()) {
        return `Question ${
          questionIndex + 1
        } cannot be empty.`
      }

      if (
        !Array.isArray(question.options) ||
        question.options.length < 2
      ) {
        return `Question ${
          questionIndex + 1
        } must have at least 2 options.`
      }

      const hasEmptyOption =
        question.options.some(
          (option) => !option.text.trim()
        )

      if (hasEmptyOption) {
        return `Please fill all options in Question ${
          questionIndex + 1
        }.`
      }

      const correctCount =
        question.options.filter(
          (option) => option.isCorrect
        ).length

      if (correctCount !== 1) {
        return `Question ${
          questionIndex + 1
        } must have exactly one correct answer.`
      }
    }

    return null
  }

  // ==========================================
  // UPDATE QUIZ
  // ==========================================

  async function handleSubmit(event) {
    event.preventDefault()

    const validationError = validateForm()

    if (validationError) {
      setError(validationError)
      return
    }

    try {
      setSaving(true)
      setError('')

      const payload = {
        title: form.title.trim(),

        description: form.description.trim(),

        category: form.category.trim(),

        difficulty: form.difficulty,

        durationMinutes:
          Number(form.durationMinutes),

        questions: questions.map((question) => ({
          questionText:
            question.questionText.trim(),

          options: question.options.map(
            (option) => ({
              text: option.text.trim(),
              isCorrect: option.isCorrect
            })
          )
        }))
      }

      await api.put(
        `/quizzes/${id}`,
        payload
      )

      navigate('/admin')
    } catch (err) {
      console.error('Update quiz error:', err)

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
      <div
        className="container"
        style={{
          display: 'flex',
          justifyContent: 'center',
          paddingTop: 100
        }}
      >
        <div className="loader" />
      </div>
    )
  }

  return (
    <div
      className="container"
      style={{
        maxWidth: 900,
        paddingTop: 50,
        paddingBottom: 100
      }}
    >
      {/* Header */}

      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'flex-end',
          gap: 20,
          marginBottom: 30
        }}
      >
        <div>
          <span className="eyebrow">
            Admin
          </span>

          <h1
            style={{
              fontSize: 36,
              marginTop: 8,
              marginBottom: 8
            }}
          >
            Edit Quiz
          </h1>

          <p
            style={{
              color: 'var(--muted)',
              margin: 0
            }}
          >
            Update quiz information, questions and
            correct answers.
          </p>
        </div>

        <Link
          to="/admin"
          className="btn btn-ghost"
        >
          Back
        </Link>
      </div>

      {/* Error */}

      {error && (
        <div
          className="card"
          style={{
            borderColor: 'var(--red)',
            marginBottom: 22,
            padding: 16
          }}
        >
          <p
            className="error-text"
            style={{ margin: 0 }}
          >
            {error}
          </p>
        </div>
      )}

      <form onSubmit={handleSubmit}>
        {/* ==================================
            BASIC DETAILS
        =================================== */}

        <div
          className="card"
          style={{
            marginBottom: 22
          }}
        >
          <span className="eyebrow">
            Quiz information
          </span>

          <h2
            style={{
              fontSize: 24,
              marginTop: 7,
              marginBottom: 25
            }}
          >
            Basic Details
          </h2>

          <div className="field">
            <label htmlFor="title">
              Quiz Title
            </label>

            <input
              id="title"
              name="title"
              className="input"
              value={form.title}
              onChange={handleChange}
            />
          </div>

          <div className="field">
            <label htmlFor="description">
              Description
            </label>

            <textarea
              id="description"
              name="description"
              className="input"
              rows="4"
              value={form.description}
              onChange={handleChange}
              style={{
                resize: 'vertical'
              }}
            />
          </div>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns:
                'repeat(3, 1fr)',
              gap: 15
            }}
          >
            <div className="field">
              <label htmlFor="category">
                Category
              </label>

              <input
                id="category"
                name="category"
                className="input"
                value={form.category}
                onChange={handleChange}
              />
            </div>

            <div className="field">
              <label htmlFor="difficulty">
                Difficulty
              </label>

              <select
                id="difficulty"
                name="difficulty"
                className="input"
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

            <div className="field">
              <label htmlFor="durationMinutes">
                Duration
              </label>

              <input
                id="durationMinutes"
                name="durationMinutes"
                type="number"
                min="1"
                max="120"
                className="input"
                value={form.durationMinutes}
                onChange={handleChange}
              />
            </div>
          </div>
        </div>

        {/* ==================================
            QUESTIONS
        =================================== */}

        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginTop: 40,
            marginBottom: 18
          }}
        >
          <div>
            <span className="eyebrow">
              Questions
            </span>

            <h2
              style={{
                fontSize: 27,
                marginTop: 6
              }}
            >
              Quiz Questions
            </h2>
          </div>

          <span className="pill">
            {questions.length}{' '}
            {questions.length === 1
              ? 'Question'
              : 'Questions'}
          </span>
        </div>

        {questions.map(
          (question, questionIndex) => (
            <div
              className="card"
              key={questionIndex}
              style={{
                marginBottom: 18
              }}
            >
              {/* Question Header */}

              <div
                style={{
                  display: 'flex',
                  justifyContent:
                    'space-between',
                  alignItems: 'center',
                  gap: 15,
                  marginBottom: 20
                }}
              >
                <h3
                  style={{
                    fontSize: 20
                  }}
                >
                  Question {questionIndex + 1}
                </h3>

                <button
                  type="button"
                  className="btn btn-ghost"
                  onClick={() =>
                    removeQuestion(questionIndex)
                  }
                  style={{
                    padding: '8px 13px',
                    color: 'var(--red)'
                  }}
                >
                  Remove
                </button>
              </div>

              {/* Question Text */}

              <div className="field">
                <label>
                  Question Text
                </label>

                <input
                  className="input"
                  value={question.questionText}
                  onChange={(event) =>
                    updateQuestion(
                      questionIndex,
                      event.target.value
                    )
                  }
                />
              </div>

              {/* Options */}

              <label>
                Options — select the correct answer
              </label>

              <div
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 12,
                  marginTop: 10
                }}
              >
                {question.options.map(
                  (option, optionIndex) => (
                    <div
                      key={optionIndex}
                      style={{
                        display: 'grid',
                        gridTemplateColumns:
                          '42px 1fr',
                        gap: 10,
                        alignItems: 'center'
                      }}
                    >
                      <input
                        type="radio"
                        name={`correct-${questionIndex}`}
                        checked={option.isCorrect}
                        onChange={() =>
                          setCorrectOption(
                            questionIndex,
                            optionIndex
                          )
                        }
                        style={{
                          width: 18,
                          height: 18,
                          margin: '0 auto',
                          accentColor:
                            'var(--amber)'
                        }}
                      />

                      <input
                        className="input"
                        value={option.text}
                        onChange={(event) =>
                          updateOption(
                            questionIndex,
                            optionIndex,
                            event.target.value
                          )
                        }
                      />
                    </div>
                  )
                )}
              </div>
            </div>
          )
        )}

        {/* Add Question */}

        <button
          type="button"
          className="btn btn-ghost"
          onClick={addQuestion}
          style={{
            width: '100%',
            marginTop: 5,
            marginBottom: 30,
            borderStyle: 'dashed'
          }}
        >
          + Add Another Question
        </button>

        {/* Actions */}

        <div
          style={{
            display: 'flex',
            justifyContent: 'flex-end',
            gap: 12
          }}
        >
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
  )
}