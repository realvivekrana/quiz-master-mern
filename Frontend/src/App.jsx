import {
  Link,
  Route,
  Routes
} from 'react-router-dom'

// ==========================================
// COMPONENTS
// ==========================================

import Navbar from './components/Navbar'
import PrivateRoute from './components/PrivateRoute'
import AdminRoute from './components/AdminRoute'

// ==========================================
// PUBLIC / USER PAGES
// ==========================================

import Home from './pages/Home'
import Login from './pages/Login'
import Register from './pages/Register'
import Dashboard from './pages/Dashboard'
import History from './pages/History'
import QuizPlay from './pages/QuizPlay'
import Result from './pages/Result'
import Leaderboard from './pages/Leaderboard'

// ==========================================
// ADMIN PAGES
// ==========================================

import AdminDashboard from './pages/AdminDashboard'
import AdminUsers from './pages/AdminUsers'
import CreateQuiz from './pages/CreateQuiz'
import EditQuiz from './pages/EditQuiz'

// ==========================================
// APP
// ==========================================

export default function App() {
  return (
    <>
      {/* ==================================
          GLOBAL NAVBAR
      =================================== */}

      <Navbar />

      {/* ==================================
          APPLICATION ROUTES
      =================================== */}

      <Routes>
        {/* ==================================
            PUBLIC ROUTES
        =================================== */}

        {/* Home */}

        <Route
          path="/"
          element={<Home />}
        />

        {/* Login */}

        <Route
          path="/login"
          element={<Login />}
        />

        {/* Register */}

        <Route
          path="/register"
          element={<Register />}
        />

        {/* ==================================
            AUTHENTICATED USER ROUTES
        =================================== */}

        {/* Dashboard */}

        <Route
          path="/dashboard"
          element={
            <PrivateRoute>
              <Dashboard />
            </PrivateRoute>
          }
        />

        {/* Quiz History */}

        <Route
          path="/history"
          element={
            <PrivateRoute>
              <History />
            </PrivateRoute>
          }
        />

        {/* Play Quiz */}

        <Route
          path="/quiz/:id"
          element={
            <PrivateRoute>
              <QuizPlay />
            </PrivateRoute>
          }
        />

        {/* Quiz Result */}

        <Route
          path="/result/:id"
          element={
            <PrivateRoute>
              <Result />
            </PrivateRoute>
          }
        />

        {/* Quiz Leaderboard */}

        <Route
          path="/quiz/:id/leaderboard"
          element={
            <PrivateRoute>
              <Leaderboard />
            </PrivateRoute>
          }
        />

        {/* ==================================
            ADMIN ROUTES
        =================================== */}

        {/* Admin Dashboard */}

        <Route
          path="/admin"
          element={
            <AdminRoute>
              <AdminDashboard />
            </AdminRoute>
          }
        />

        {/* Admin Users */}

        <Route
          path="/admin/users"
          element={
            <AdminRoute>
              <AdminUsers />
            </AdminRoute>
          }
        />

        {/* Create Quiz */}

        <Route
          path="/admin/quizzes/create"
          element={
            <AdminRoute>
              <CreateQuiz />
            </AdminRoute>
          }
        />

        {/* Edit Quiz */}

        <Route
          path="/admin/quizzes/:id/edit"
          element={
            <AdminRoute>
              <EditQuiz />
            </AdminRoute>
          }
        />

        {/* ==================================
            404 ROUTE
        =================================== */}

        <Route
          path="*"
          element={<NotFound />}
        />
      </Routes>
    </>
  )
}

// ==========================================
// 404 PAGE
// ==========================================

function NotFound() {
  return (
    <main className="page">
      <div
        className="container"
        style={{
          maxWidth: 650
        }}
      >
        <div
          className="card"
          style={{
            textAlign: 'center',
            paddingBlock: 50
          }}
        >
          <span
            className="eyebrow"
            style={{
              color: 'var(--amber)'
            }}
          >
            Error 404
          </span>

          <h1
            style={{
              marginTop: 8,
              marginBottom: 10,
              fontSize:
                'clamp(30px, 9vw, 44px)'
            }}
          >
            Page not found
          </h1>

          <p
            style={{
              maxWidth: 450,
              margin: '0 auto 24px',
              color: 'var(--muted)',
              lineHeight: 1.7
            }}
          >
            The page you are looking for does
            not exist or may have been moved.
          </p>

          <Link
            to="/"
            className="btn btn-primary"
          >
            Back to Home
          </Link>
        </div>
      </div>
    </main>
  )
}