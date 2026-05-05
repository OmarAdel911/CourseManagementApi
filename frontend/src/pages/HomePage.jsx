import { useState } from 'react'
import { login, logout, signUpStudent } from '../services/authService'

const roleDefaults = {
  Admin: { email: 'admin@uni.com', password: 'password123' },
  Student: { email: '', password: '' },
}

function HomePage({ onAuthChange }) {
  const [role, setRole] = useState('Admin')
  const [loginEmail, setLoginEmail] = useState(roleDefaults.Admin.email)
  const [loginPassword, setLoginPassword] = useState(roleDefaults.Admin.password)

  const [signupFullName, setSignupFullName] = useState('')
  const [signupEmail, setSignupEmail] = useState('')
  const [signupPassword, setSignupPassword] = useState('')

  const [message, setMessage] = useState('')
  const [signupMessage, setSignupMessage] = useState('')
  const [messageType, setMessageType] = useState('success')
  const [signupMessageType, setSignupMessageType] = useState('success')

  const [loading, setLoading] = useState(false)
  const [signupLoading, setSignupLoading] = useState(false)

  const handleRoleChange = (nextRole) => {
    setRole(nextRole)
    setLoginEmail(roleDefaults[nextRole].email)
    setLoginPassword(roleDefaults[nextRole].password)
    setMessage('')
  }

  const handleLogin = async (event) => {
    event.preventDefault()
    setLoading(true)
    setMessage('')

    try {
      const session = await login(role, loginEmail, loginPassword)
      onAuthChange(session)
      setMessageType('success')
      setMessage(`Signed in as ${role}.`)
    } catch (error) {
      setMessageType('error')
      setMessage(error.message)
    } finally {
      setLoading(false)
    }
  }

  const handleStudentSignup = async (event) => {
    event.preventDefault()
    setSignupLoading(true)
    setSignupMessage('')

    try {
      await signUpStudent(signupFullName, signupEmail, signupPassword)
      setSignupMessageType('success')
      setSignupMessage('Account created. You can login now with your custom password.')

      setLoginEmail(signupEmail)
      setLoginPassword(signupPassword)
      setSignupFullName('')
      setSignupEmail('')
      setSignupPassword('')
    } catch (error) {
      setSignupMessageType('error')
      setSignupMessage(error.message)
    } finally {
      setSignupLoading(false)
    }
  }

  const handleLogout = () => {
    logout()
    onAuthChange({ role: '', studentId: null })
    setMessageType('success')
    setMessage('Logged out successfully.')
  }

  return (
    <section>
      <h1>Welcome to the Course Management Frontend</h1>
      <p>Choose your role, sign in, and continue to the Courses page.</p>

      <h3>Sign In</h3>
      <div className="role-toggle">
        <button
          className={role === 'Admin' ? 'role-btn active-role' : 'role-btn'}
          onClick={() => handleRoleChange('Admin')}
          type="button"
        >
          Admin
        </button>
        <button
          className={role === 'Student' ? 'role-btn active-role' : 'role-btn'}
          onClick={() => handleRoleChange('Student')}
          type="button"
        >
          Student
        </button>
      </div>

      <form className="form" onSubmit={handleLogin}>
        <label htmlFor="email">Email</label>
        <input
          id="email"
          type="email"
          value={loginEmail}
          onChange={(event) => setLoginEmail(event.target.value)}
          required
        />

        <label htmlFor="password">Password</label>
        <input
          id="password"
          type="password"
          value={loginPassword}
          onChange={(event) => setLoginPassword(event.target.value)}
          required
        />

        <button disabled={loading} type="submit">
          {loading ? 'Logging in...' : `Login as ${role}`}
        </button>
      </form>

      <button onClick={handleLogout} type="button" className="secondary-btn">
        Logout
      </button>

      {message && <p className={messageType === 'error' ? 'error' : 'feedback'}>{message}</p>}
      {role === 'Student' && (
        <>
          <p className="hint">New student? Create an account below with your own password.</p>
          <form className="form signup-form" onSubmit={handleStudentSignup}>
            <label htmlFor="fullName">Full Name</label>
            <input
              id="fullName"
              type="text"
              value={signupFullName}
              onChange={(event) => setSignupFullName(event.target.value)}
              required
            />
            <label htmlFor="signupEmail">Email</label>
            <input
              id="signupEmail"
              type="email"
              value={signupEmail}
              onChange={(event) => setSignupEmail(event.target.value)}
              required
            />
            <label htmlFor="signupPassword">Password</label>
            <input
              id="signupPassword"
              type="password"
              value={signupPassword}
              onChange={(event) => setSignupPassword(event.target.value)}
              minLength={6}
              required
            />
            <button disabled={signupLoading} type="submit">
              {signupLoading ? 'Creating account...' : 'Sign Up as Student'}
            </button>
          </form>
          {signupMessage && (
            <p className={signupMessageType === 'error' ? 'error' : 'feedback'}>{signupMessage}</p>
          )}
        </>
      )}
    </section>
  )
}

export default HomePage
