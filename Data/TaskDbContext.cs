using Microsoft.EntityFrameworkCore;
using TaskAPI.Models;

namespace TaskAPI.Data
{
    public class TaskDbContext : DbContext
    {
        public TaskDbContext(DbContextOptions<TaskDbContext> options) : base(options) { }

        public DbSet<TaskAPI.Models.Task> Tasks { get; set; }
    }
}
