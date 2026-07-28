import { Navigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function AdminRoute({ children }) {
  const { user } = useAuth()

  // Login nahi hai
  if (!user) {
    return <Navigate to="/login" replace />
  }

  // Login hai lekin admin nahi hai
  if (user.role !== 'admin') {
    return <Navigate to="/dashboard" replace />
  }

  // Admin hai
  return children
}