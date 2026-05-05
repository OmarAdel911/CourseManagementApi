import { apiClient, setToken } from './api'

const SESSION_KEY = 'session'

const extractApiErrorMessage = (error, fallbackMessage) => {
  const responseData = error?.response?.data

  if (typeof responseData === 'string' && responseData.trim()) {
    return responseData
  }

  if (responseData?.title) {
    return responseData.title
  }

  return fallbackMessage
}

export const getSession = () => {
  const rawSession = localStorage.getItem(SESSION_KEY)
  if (!rawSession) return { role: '', studentId: null }

  try {
    return JSON.parse(rawSession)
  } catch {
    return { role: '', studentId: null }
  }
}

const saveSession = (session) => {
  localStorage.setItem(SESSION_KEY, JSON.stringify(session))
}

export const login = async (role, email, password) => {
  try {
    const response = await apiClient.post('/Auth/login', { role, email, password })
    const { token, studentId } = response.data

    setToken(token)
    saveSession({ role, studentId: studentId ?? null })

    return { role, studentId: studentId ?? null }
  } catch (error) {
    throw new Error(extractApiErrorMessage(error, 'Login failed.'))
  }
}

export const signUpStudent = async (fullName, email, password) => {
  try {
    const response = await apiClient.post('/Auth/signup-student', { fullName, email, password })
    return response.data
  } catch (error) {
    throw new Error(extractApiErrorMessage(error, 'Signup failed.'))
  }
}

export const logout = () => {
  setToken('')
  localStorage.removeItem(SESSION_KEY)
}
