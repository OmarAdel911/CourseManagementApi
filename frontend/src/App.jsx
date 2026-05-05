import { Navigate, Route, Routes } from 'react-router-dom'
import Navbar from './components/Navbar'
import AddInstructorPage from './pages/AddInstructorPage'
import CreatePage from './pages/CreatePage'
import DetailsPage from './pages/DetailsPage'
import HomePage from './pages/HomePage'
import ListPage from './pages/ListPage'
import { getSession } from './services/authService'
import { useState } from 'react'

function App() {
  const [session, setSession] = useState(getSession())

  return (
    <div className="app-container">
      <Navbar role={session.role} />
      <main>
        <Routes>
          <Route path="/" element={<HomePage onAuthChange={setSession} />} />
          <Route path="/items" element={<ListPage role={session.role} />} />
          <Route
            path="/items/new"
            element={session.role === 'Admin' ? <CreatePage /> : <Navigate to="/" replace />}
          />
          <Route
            path="/instructors/new"
            element={session.role === 'Admin' ? <AddInstructorPage /> : <Navigate to="/" replace />}
          />
          <Route path="/items/:id" element={<DetailsPage role={session.role} />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
    </div>
  )
}

export default App
