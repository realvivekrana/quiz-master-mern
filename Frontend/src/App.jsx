import { Route, Routes } from 'react-router-dom'

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
import QuizPlay from './pages/QuizPlay'
import Result from './pages/Result'
import Leaderboard from './pages/Leaderboard'
import QuizHistory from './pages/QuizHistory'

// ==========================================
// ADMIN PAGES
// ==========================================

import AdminDashboard from './pages/AdminDashboard'
import CreateQuiz from './pages/CreateQuiz'
import EditQuiz from './pages/EditQuiz'
import AdminUsers from './pages/AdminUsers'

// ==========================================
// APP
// ==========================================

export default function App() {
  return (
    <>
      <Navbar />

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
            USER ROUTES
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
              <QuizHistory />
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

        {/* Admin User Management */}
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
      </Routes>
    </>
  )
}