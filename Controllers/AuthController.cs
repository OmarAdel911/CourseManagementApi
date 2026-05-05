using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using System.Security.Cryptography;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
[ApiController]
[Route("api/[controller]")]
public class AuthController : ControllerBase
{
    private readonly IConfiguration _config;
    private readonly AppDbContext _context;

    public AuthController(IConfiguration config, AppDbContext context)
    {
        _config = config;
        _context = context;
    }

    [HttpPost("login")]
    public async Task<IActionResult> Login([FromBody] LoginDto dto)
    {
        if (dto.Role == "Admin" && dto.Email == "admin@uni.com" && dto.Password == "password123")
        {
            var token = GenerateToken(dto.Email, "Admin");
            return Ok(new { token, role = "Admin" });
        }

        if (dto.Role == "Student")
        {
            var student = await _context.Students
                .AsNoTracking()
                .FirstOrDefaultAsync(s => s.Email == dto.Email);

            if (student is not null && VerifyPassword(dto.Password, student.PasswordHash))
            {
                var token = GenerateToken(student.Email, "Student", student.Id);
                return Ok(new { token, role = "Student", studentId = student.Id });
            }
        }

        return Unauthorized();
    }

    [HttpPost("signup-student")]
    [AllowAnonymous]
    public async Task<IActionResult> SignUpStudent([FromBody] SignUpStudentDto dto)
    {
        var emailExists = await _context.Students
            .AsNoTracking()
            .AnyAsync(s => s.Email.ToLower() == dto.Email.ToLower());

        if (emailExists)
        {
            return BadRequest("A student account with this email already exists.");
        }

        var student = new Student
        {
            FullName = dto.FullName,
            Email = dto.Email,
            PasswordHash = HashPassword(dto.Password)
        };

        _context.Students.Add(student);
        await _context.SaveChangesAsync();

        return Created(string.Empty, new
        {
            student.Id,
            student.FullName,
            student.Email
        });
    }

    private static string HashPassword(string password)
    {
        var bytes = SHA256.HashData(Encoding.UTF8.GetBytes(password));
        return Convert.ToBase64String(bytes);
    }

    private static bool VerifyPassword(string password, string passwordHash)
    {
        return HashPassword(password) == passwordHash;
    }

    private string GenerateToken(string email, string role, int? studentId = null)
    {
        var claims = new List<Claim>
        {
            new Claim(ClaimTypes.Email, email),
            new Claim(ClaimTypes.Role, role)
        };
        if (studentId is not null)
        {
            claims.Add(new Claim(ClaimTypes.NameIdentifier, studentId.Value.ToString()));
        }

        var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_config["Jwt:Key"]!));
        var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

        var token = new JwtSecurityToken(
            issuer: _config["Jwt:Issuer"],
            audience: _config["Jwt:Audience"],
            claims: claims,
            expires: DateTime.UtcNow.AddHours(1),
            signingCredentials: creds
        );

        return new JwtSecurityTokenHandler().WriteToken(token);
    }
}