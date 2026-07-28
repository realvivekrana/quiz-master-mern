import axios from 'axios'

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api'

const api = axios.create({
  baseURL: API_BASE_URL
})

// attach JWT token (if present) to every outgoing request
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('qm_token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

// auto-logout on 401 from backend
api.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401) {
      localStorage.removeItem('qm_token')
      localStorage.removeItem('qm_user')
      window.location.href = '/login'
    }
    return Promise.reject(err)
  }
)

export default api