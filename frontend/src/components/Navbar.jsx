import { Link } from 'react-router-dom'

function Navbar({ role }) {
  return (
    <nav className="nav">
      <h2>Course Manager</h2>
      <div className="nav-links">
        <Link to="/">Home</Link>
        <Link to="/items">Courses</Link>
        {role === 'Admin' && <Link to="/items/new">Add New Course</Link>}
        {role === 'Admin' && <Link to="/instructors/new">Add Instructor</Link>}
      </div>
      <span className="role-label">{role ? `Signed in: ${role}` : 'Not signed in'}</span>
    </nav>
  )
}

export default Navbar
