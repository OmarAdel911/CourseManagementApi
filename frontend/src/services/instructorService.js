import { apiClient } from './api'

export const getInstructors = async () => {
  const response = await apiClient.get('/Instructors')
  return response.data
}

export const createInstructor = async (instructorData) => {
  const response = await apiClient.post('/Instructors', instructorData)
  return response.data
}
