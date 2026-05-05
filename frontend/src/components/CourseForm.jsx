import { useEffect, useMemo, useState } from 'react'

const defaultInitialValues = {
  title: '',
  credits: 3,
  instructorId: '',
}

function CourseForm({
  initialValues,
  instructors,
  onSubmit,
  submitLabel = 'Save',
  loading = false,
}) {
  const fallbackInstructorId = useMemo(() => {
    return instructors.length > 0 ? instructors[0].id : ''
  }, [instructors])

  const [formData, setFormData] = useState(
    initialValues ?? { ...defaultInitialValues, instructorId: fallbackInstructorId },
  )

  useEffect(() => {
    if (!formData.instructorId && fallbackInstructorId) {
      setFormData((prev) => ({ ...prev, instructorId: fallbackInstructorId }))
    }
  }, [fallbackInstructorId, formData.instructorId])

  const handleChange = (event) => {
    const { name, value } = event.target

    setFormData((prev) => ({
      ...prev,
      [name]: name === 'title' ? value : Number(value),
    }))
  }

  const handleSubmit = (event) => {
    event.preventDefault()
    onSubmit(formData)
  }

  return (
    <form className="form" onSubmit={handleSubmit}>
      <label htmlFor="title">Title</label>
      <input
        id="title"
        name="title"
        type="text"
        required
        maxLength={100}
        value={formData.title}
        onChange={handleChange}
      />

      <label htmlFor="credits">Credits</label>
      <input
        id="credits"
        name="credits"
        type="number"
        min="1"
        max="10"
        required
        value={formData.credits}
        onChange={handleChange}
      />

      <label htmlFor="instructorId">Instructor</label>
      <select
        id="instructorId"
        name="instructorId"
        required
        value={formData.instructorId}
        onChange={handleChange}
      >
        <option value="" disabled>
          Select an instructor
        </option>
        {instructors.map((instructor) => (
          <option key={instructor.id} value={instructor.id}>
            {instructor.fullName} (#{instructor.id})
          </option>
        ))}
      </select>

      <button disabled={loading || instructors.length === 0} type="submit">
        {loading ? 'Submitting...' : submitLabel}
      </button>
    </form>
  )
}

export default CourseForm
