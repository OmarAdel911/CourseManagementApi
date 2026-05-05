using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using Microsoft.EntityFrameworkCore;
using System.Security.Claims;
[ApiController]
[Route("api/[controller]")]
[Authorize]                          // all endpoints require a valid JWT by default
public class CoursesController : ControllerBase
{
    private readonly ICourseService _courseService;
    private readonly AppDbContext _context;

    public CoursesController(ICourseService courseService, AppDbContext context)
    {
        _courseService = courseService;
        _context = context;
    }

    [HttpGet]
    public async Task<IActionResult> GetAll()
    {
        var courses = await _courseService.GetAllAsync();
        return Ok(courses);
    }

    [HttpGet("{id}")]
    public async Task<IActionResult> GetById(int id)
    {
        var course = await _courseService.GetByIdAsync(id);
        return course is null ? NotFound() : Ok(course);
    }

    [HttpGet("registered")]
    [Authorize(Roles = "Student")]
    public async Task<IActionResult> GetRegisteredCourses()
    {
        var studentIdClaim = User.FindFirstValue(ClaimTypes.NameIdentifier);
        if (!int.TryParse(studentIdClaim, out var studentId))
        {
            return Unauthorized();
        }

        var courses = await _context.Enrollments
            .AsNoTracking()
            .Where(e => e.StudentId == studentId)
            .Select(e => new CourseResponseDto
            {
                Id = e.Course.Id,
                Title = e.Course.Title,
                Credits = e.Course.Credits,
                InstructorId = e.Course.InstructorId,
                InstructorName = e.Course.Instructor.FullName
            })
            .ToListAsync();

        return Ok(courses);
    }

    [HttpPost]
    [Authorize(Roles = "Admin")]     // only Admins can create
    public async Task<IActionResult> Create([FromBody] CreateCourseDto dto)
    {
        var created = await _courseService.CreateAsync(dto);
        return CreatedAtAction(nameof(GetById), new { id = created.Id }, created);
    }

    [HttpPut("{id}")]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> Update(int id, [FromBody] UpdateCourseDto dto)
    {
        var updated = await _courseService.UpdateAsync(id, dto);
        return updated is null ? NotFound() : Ok(updated);
    }

    [HttpDelete("{id}")]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> Delete(int id)
    {
        var deleted = await _courseService.DeleteAsync(id);
        return deleted ? NoContent() : NotFound();
    }

    [HttpPost("{id}/register")]
    [Authorize(Roles = "Student")]
    public async Task<IActionResult> RegisterToCourse(int id)
    {
        var studentIdClaim = User.FindFirstValue(ClaimTypes.NameIdentifier);
        if (!int.TryParse(studentIdClaim, out var studentId))
        {
            return Unauthorized();
        }

        var courseExists = await _context.Courses.AnyAsync(c => c.Id == id);
        if (!courseExists) return NotFound("Course not found.");

        var studentExists = await _context.Students.AnyAsync(s => s.Id == studentId);
        if (!studentExists) return NotFound("Student not found.");

        var alreadyEnrolled = await _context.Enrollments
            .AnyAsync(e => e.CourseId == id && e.StudentId == studentId);

        if (alreadyEnrolled)
        {
            return BadRequest("Already registered");
        }

        _context.Enrollments.Add(new Enrollment
        {
            CourseId = id,
            StudentId = studentId
        });
        await _context.SaveChangesAsync();

        return Ok(new { message = "Enrollment successful." });
    }

    [HttpDelete("{id}/register")]
    [Authorize(Roles = "Student")]
    public async Task<IActionResult> UnregisterFromCourse(int id)
    {
        var studentIdClaim = User.FindFirstValue(ClaimTypes.NameIdentifier);
        if (!int.TryParse(studentIdClaim, out var studentId))
        {
            return Unauthorized();
        }

        var enrollment = await _context.Enrollments
            .FirstOrDefaultAsync(e => e.CourseId == id && e.StudentId == studentId);

        if (enrollment is null)
        {
            return NotFound("Enrollment not found.");
        }

        _context.Enrollments.Remove(enrollment);
        await _context.SaveChangesAsync();

        return Ok(new { message = "Unregistered successfully." });
    }

    [HttpGet("{id}/enrollments")]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> GetEnrolledStudents(int id)
    {
        var courseExists = await _context.Courses.AnyAsync(c => c.Id == id);
        if (!courseExists) return NotFound();

        var students = await _context.Enrollments
            .AsNoTracking()
            .Where(e => e.CourseId == id)
            .Select(e => new EnrolledStudentDto
            {
                StudentId = e.StudentId,
                StudentName = e.Student.FullName,
                StudentEmail = e.Student.Email,
                EnrolledAt = e.EnrolledAt
            })
            .ToListAsync();

        return Ok(students);
    }
}