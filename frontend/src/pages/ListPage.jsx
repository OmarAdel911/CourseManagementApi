import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import {
  deleteCourse,
  getCourseEnrollments,
  getCourses,
  getRegisteredCourses,
  registerCourse,
  unregisterCourse,
} from '../services/courseService'

function ListPage({ role }) {
  const [courses, setCourses] = useState([])
  const [registeredCourses, setRegisteredCourses] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [feedback, setFeedback] = useState('')
  const [enrollmentsByCourse, setEnrollmentsByCourse] = useState({})

  const registeredCourseIds = useMemo(() => {
    return new Set(registeredCourses.map((course) => course.id))
  }, [registeredCourses])

  const loadCourses = async () => {
    setLoading(true)
    setError('')

    try {
      const [allCourses, studentRegisteredCourses] = await Promise.all([
        getCourses(),
        role === 'Student' ? getRegisteredCourses() : Promise.resolve([]),
      ])

      setCourses(allCourses)
      setRegisteredCourses(studentRegisteredCourses)
    } catch {
      setError('Unable to fetch courses. Make sure API is running and you are logged in.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadCourses()
  }, [role])

  const handleDelete = async (id) => {
    try {
      await deleteCourse(id)
      setCourses((prev) => prev.filter((course) => course.id !== id))
      setRegisteredCourses((prev) => prev.filter((course) => course.id !== id))
      setFeedback('Course deleted successfully.')
    } catch {
      setError('Delete failed. You need an Admin token.')
    }
  }

  const handleRegister = async (id) => {
    setError('')
    setFeedback('')

    try {
      await registerCourse(id)
      const newlyRegistered = courses.find((course) => course.id === id)

      if (newlyRegistered) {
        setRegisteredCourses((prev) => {
          if (prev.some((course) => course.id === id)) return prev
          return [...prev, newlyRegistered]
        })
      }

      setFeedback('Registered to course successfully.')
    } catch (requestError) {
      const serverMessage = requestError?.response?.data
      if (serverMessage === 'Already registered') {
        setError('Already registered')
      } else {
        setError('Registration failed. Please try again.')
      }
    }
  }

  const handleViewEnrollments = async (id) => {
    setError('')
    setFeedback('')

    try {
      const data = await getCourseEnrollments(id)
      setEnrollmentsByCourse((prev) => ({ ...prev, [id]: data }))
    } catch {
      setError('Failed to load enrolled students for this course.')
    }
  }

  const handleUnregister = async (id) => {
    setError('')
    setFeedback('')

    try {
      await unregisterCourse(id)
      setRegisteredCourses((prev) => prev.filter((course) => course.id !== id))
      setFeedback('Unregistered from course successfully.')
    } catch {
      setError('Failed to unregister from this course.')
    }
  }

  if (loading) return <p>Loading courses...</p>

  return (
    <section>
      <h1>All Courses</h1>

      {feedback && <p className="feedback">{feedback}</p>}
      {error && <p className="error">{error}</p>}

      {role === 'Student' && (
        <div className="enrollments-panel">
          <h3>My Registered Courses</h3>
          {registeredCourses.length === 0 ? (
            <p>You have not registered for any courses yet.</p>
          ) : (
            <ul>
              {registeredCourses.map((course) => (
                <li key={`registered-${course.id}`}>
                  {course.title} - {course.instructorName}
                  <button
                    className="inline-action-btn"
                    onClick={() => handleUnregister(course.id)}
                    type="button"
                  >
                    Unregister
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}

      {courses.length === 0 ? (
        <p>No courses found.</p>
      ) : (
        <ul className="list">
          {courses.map((course) => {
            const isRegistered = registeredCourseIds.has(course.id)

            return (
              <li key={course.id} className="card">
                <h3>{course.title}</h3>
                <p>Credits: {course.credits}</p>
                <p>Instructor: {course.instructorName}</p>
                <div className="actions">
                  <Link to={`/items/${course.id}`}>View</Link>

                  {role === 'Admin' && (
                    <>
                      <button onClick={() => handleViewEnrollments(course.id)} type="button">
                        View Enrolled Students
                      </button>
                      <button onClick={() => handleDelete(course.id)} type="button">
                        Delete
                      </button>
                    </>
                  )}

                  {role === 'Student' && (
                    <button
                      onClick={() => handleRegister(course.id)}
                      type="button"
                      disabled={isRegistered}
                    >
                      {isRegistered ? 'Already registered' : 'Register'}
                    </button>
                  )}
                </div>

                {role === 'Admin' && enrollmentsByCourse[course.id] && (
                  <div className="enrollments-panel">
                    <h4>Enrolled Students</h4>
                    {enrollmentsByCourse[course.id].length === 0 ? (
                      <p>No students enrolled.</p>
                    ) : (
                      <ul>
                        {enrollmentsByCourse[course.id].map((entry) => (
                          <li key={`${course.id}-${entry.studentId}`}>
                            {entry.studentName} ({entry.studentEmail})
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                )}
              </li>
            )
          })}
        </ul>
      )}
    </section>
  )
}

export default ListPage
