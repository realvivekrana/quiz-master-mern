import { Route, Routes } from 'react-router-dom'
import Navbar from './components/Navbar'
import PrivateRoute from './components/PrivateRoute'
import Home from './pages/Home'
import Login from './pages/Login'
import Register from './pages/Register'
import Dashboard from './pages/Dashboard'
import QuizPlay from './pages/QuizPlay'
import Result from './pages/Result'

export default function App() {
  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route
          path="/dashboard"
          element={
            <PrivateRoute>
              <Dashboard />
            </PrivateRoute>
          }
        />
        <Route
          path="/quiz/:id"
          element={
            <PrivateRoute>
              <QuizPlay />
            </PrivateRoute>
          }
        />
        <Route
          path="/result/:id"
          element={
            <PrivateRoute>
              <Result />
            </PrivateRoute>
          }
        />
      </Routes>
    </>
  )
}