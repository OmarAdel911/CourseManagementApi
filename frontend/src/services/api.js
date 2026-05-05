import axios from 'axios'

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:5007/api'

let authToken = localStorage.getItem('token') ?? ''

export const setToken = (token) => {
  authToken = token ?? ''

  if (authToken) {
    localStorage.setItem('token', authToken)
  } else {
    localStorage.removeItem('token')
  }
}

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
})

apiClient.interceptors.request.use((config) => {
  if (authToken) {
    config.headers.Authorization = `Bearer ${authToken}`
  }

  return config
})
