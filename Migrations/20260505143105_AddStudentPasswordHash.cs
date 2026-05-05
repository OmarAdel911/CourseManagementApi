using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace CourseManagementAPI.Migrations
{
    /// <inheritdoc />
    public partial class AddStudentPasswordHash : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "PasswordHash",
                table: "Students",
                type: "TEXT",
                nullable: false,
                defaultValue: "75K3eLr+dx6JJFuJ7LwIpEpOFmwGZZkRiB84PURz6U8=");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "PasswordHash",
                table: "Students");
        }
    }
}
