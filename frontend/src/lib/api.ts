import axios, { AxiosError, InternalAxiosRequestConfig } from 'axios'
import { tokenStorage } from './storage'
import { useSession } from '../store/session'

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || '/api',
  timeout: 30000, // 30 second timeout
  headers: {
    'Content-Type': 'application/json',
  },
})

// Request interceptor - add auth token and bypass ngrok browser warning
api.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = tokenStorage.getAccessToken()
    if (config.headers) {
      if (token) {
        config.headers.Authorization = `Bearer ${token}`
      }
      // Bypass the ngrok free tier browser warning page for API calls
      config.headers['ngrok-skip-browser-warning'] = 'true'
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// Response interceptor - handle token refresh
api.interceptors.response.use(
  (res) => res,
  async (error: AxiosError) => {
    const originalRequest = error.config as InternalAxiosRequestConfig & { _retry?: boolean }
    
    // Handle 401 — clear session (no refresh endpoint yet)
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true
      useSession.getState().clear()
    }
    
    return Promise.reject(error)
  }
)

export default api


