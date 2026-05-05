import { useState } from 'react'
import { createInstructor } from '../services/instructorService'

function AddInstructorPage() {
  const [fullName, setFullName] = useState('')
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [feedback, setFeedback] = useState('')
  const [error, setError] = useState('')

  const handleSubmit = async (event) => {
    event.preventDefault()
    setLoading(true)
    setFeedback('')
    setError('')

    try {
      const created = await createInstructor({ fullName, email })
      setFeedback(`Instructor \"${created.fullName}\" created successfully.`)
      setFullName('')
      setEmail('')
    } catch (requestError) {
      if (typeof requestError?.response?.data === 'string') {
        setError(requestError.response.data)
      } else {
        setError('Failed to create instructor. Ensure you are signed in as Admin.')
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <section>
      <h1>Add Instructor</h1>
      <form className="form" onSubmit={handleSubmit}>
        <label htmlFor="instructorFullName">Full Name</label>
        <input
          id="instructorFullName"
          type="text"
          value={fullName}
          onChange={(event) => setFullName(event.target.value)}
          required
          maxLength={100}
        />

        <label htmlFor="instructorEmail">Email</label>
        <input
          id="instructorEmail"
          type="email"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          required
        />

        <button disabled={loading} type="submit">
          {loading ? 'Saving...' : 'Create Instructor'}
        </button>
      </form>

      {feedback && <p className="feedback">{feedback}</p>}
      {error && <p className="error">{error}</p>}
    </section>
  )
}

export default AddInstructorPage
