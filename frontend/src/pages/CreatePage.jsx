import { useEffect, useState } from 'react'
import CourseForm from '../components/CourseForm'
import { createCourse } from '../services/courseService'
import { getInstructors } from '../services/instructorService'

function CreatePage() {
  const [loading, setLoading] = useState(false)
  const [instructors, setInstructors] = useState([])
  const [feedback, setFeedback] = useState('')
  const [error, setError] = useState('')

  useEffect(() => {
    const loadInstructors = async () => {
      try {
        const data = await getInstructors()
        setInstructors(data)
      } catch {
        setError('Unable to load instructors. Make sure you are logged in.')
      }
    }

    loadInstructors()
  }, [])

  const handleCreate = async (formData) => {
    setLoading(true)
    setFeedback('')
    setError('')

    try {
      const created = await createCourse(formData)
      setFeedback(`Course \"${created.title}\" created successfully.`)
    } catch {
      setError('Create failed. Ensure you are logged in as Admin and values are valid.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <section>
      <h1>Add New Course</h1>
      <CourseForm
        instructors={instructors}
        onSubmit={handleCreate}
        submitLabel="Create Course"
        loading={loading}
      />
      {feedback && <p className="feedback">{feedback}</p>}
      {error && <p className="error">{error}</p>}
    </section>
  )
}

export default CreatePage
