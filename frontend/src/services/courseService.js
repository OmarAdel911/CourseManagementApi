import { apiClient } from './api'

export const getCourses = async () => {
  const response = await apiClient.get('/Courses')
  return response.data
}

export const getCourseById = async (id) => {
  const response = await apiClient.get(`/Courses/${id}`)
  return response.data
}

export const createCourse = async (courseData) => {
  const response = await apiClient.post('/Courses', courseData)
  return response.data
}

export const updateCourse = async (id, courseData) => {
  const response = await apiClient.put(`/Courses/${id}`, courseData)
  return response.data
}

export const deleteCourse = async (id) => {
  await apiClient.delete(`/Courses/${id}`)
}

export const registerCourse = async (id) => {
  const response = await apiClient.post(`/Courses/${id}/register`)
  return response.data
}

export const unregisterCourse = async (id) => {
  const response = await apiClient.delete(`/Courses/${id}/register`)
  return response.data
}

export const getCourseEnrollments = async (id) => {
  const response = await apiClient.get(`/Courses/${id}/enrollments`)
  return response.data
}

export const getRegisteredCourses = async () => {
  const response = await apiClient.get('/Courses/registered')
  return response.data
}
