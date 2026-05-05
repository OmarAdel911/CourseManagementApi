# Course Management System

Full-stack course management application with:
- ASP.NET Core + EF Core + SQLite backend API
- React (Vite) frontend
- Role-based authentication (`Admin` / `Student`)
- Course registration and enrollment management

## Application Description

This project provides a small university-style course management system.

- **Admin can**: log in, create/update/delete courses, add instructors, and view enrolled students per course.
- **Student can**: sign up with a custom password, log in, view available courses, register for courses, view registered courses, and unregister.

The backend exposes JWT-protected REST endpoints, and the frontend consumes those endpoints via Axios.

## Setup Instructions

### Prerequisites

- .NET 10 SDK
- Node.js 18+ and npm

### Backend Setup (API)

From project root:

```bash
dotnet restore
dotnet run
```

Backend runs on:

- `http://localhost:5007`

Notes:
- Database migrations are applied automatically on app startup.
- CORS is configured for frontend origin `http://localhost:5173`.

### Frontend Setup (React)

In a second terminal:

```bash
cd frontend
npm install
npm run dev
```

Frontend runs on:

- `http://localhost:5173`

## Authentication Notes

- **Admin login**
  - Email: `admin@uni.com`
  - Password: `password123`
  - Role: `Admin`

- **Student login**
  - Role: `Student`
  - Must use an existing student account (create one from Sign Up form in Home page).

## API Routes Used (by Frontend)

### Auth

- `POST /api/Auth/login` - login for Admin/Student
- `POST /api/Auth/signup-student` - student account creation

### Courses

- `GET /api/Courses` - list all courses
- `GET /api/Courses/{id}` - get course details
- `POST /api/Courses` - create course (Admin)
- `PUT /api/Courses/{id}` - update course (Admin)
- `DELETE /api/Courses/{id}` - delete course (Admin)
- `POST /api/Courses/{id}/register` - register current student to course
- `DELETE /api/Courses/{id}/register` - unregister current student from course
- `GET /api/Courses/registered` - get current student's registered courses
- `GET /api/Courses/{id}/enrollments` - get enrolled students for course (Admin)

### Instructors

- `GET /api/Instructors` - list instructors
- `GET /api/Instructors/{id}` - get instructor details
- `POST /api/Instructors` - create instructor (Admin)

### Students

- `GET /api/Students` - list students
- `GET /api/Students/{id}` - get student details
- `POST /api/Students` - create student (Admin)
- `DELETE /api/Students/{id}` - delete student (Admin)