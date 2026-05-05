import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import CourseForm from '../components/CourseForm'
import { getCourseById, updateCourse } from '../services/courseService'
import { getInstructors } from '../services/instructorService'

function DetailsPage({ role }) {
  const { id } = useParams()
  const [course, setCourse] = useState(null)
  const [instructors, setInstructors] = useState([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [feedback, setFeedback] = useState('')
  const [error, setError] = useState('')

  useEffect(() => {
    const loadPageData = async () => {
      setLoading(true)
      setError('')

      try {
        const [courseData, instructorData] = await Promise.all([
          getCourseById(id),
          getInstructors(),
        ])

        setCourse({
          title: courseData.title,
          credits: courseData.credits,
          instructorId: courseData.instructorId,
        })
        setInstructors(instructorData)
      } catch {
        setError('Failed to load this course. Confirm login/API status.')
      } finally {
        setLoading(false)
      }
    }

    loadPageData()
  }, [id])

  const handleUpdate = async (formData) => {
    setSaving(true)
    setError('')
    setFeedback('')

    try {
      const updated = await updateCourse(id, formData)
      setFeedback(`Course \"${updated.title}\" updated successfully.`)
    } catch {
      setError('Update failed. Ensure you are logged in as Admin and values are valid.')
    } finally {
      setSaving(false)
    }
  }

  if (loading) return <p>Loading item details...</p>
  if (!course) return <p className="error">Course not found.</p>

  return (
    <section>
      <h1>Course Details</h1>
      {role === 'Admin' ? (
        <>
          <h2>Edit Course</h2>
          <CourseForm
            initialValues={course}
            instructors={instructors}
            onSubmit={handleUpdate}
            submitLabel="Update Course"
            loading={saving}
          />
        </>
      ) : (
        <>
          <h3>{course.title}</h3>
          <p>Credits: {course.credits}</p>
        </>
      )}

      {feedback && <p className="feedback">{feedback}</p>}
      {error && <p className="error">{error}</p>}
    </section>
  )
}

export default DetailsPage
