using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using TaskAPI.Data;
using TaskAPI.Models;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Task = TaskAPI.Models.Task;

namespace TaskAPI.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class TasksController : ControllerBase
    {
        private readonly TaskDbContext _context;

        public TasksController(TaskDbContext context)
        {
            _context = context;
        }

        [HttpGet]
        public async System.Threading.Tasks.Task<ActionResult<IEnumerable<Task>>> GetTasks()
        {
            return await _context.Tasks.ToListAsync();
        }

        [HttpGet("{id}")]
        public async System.Threading.Tasks.Task<ActionResult<Task>> GetTask(int id)
        {
            var task = await _context.Tasks.FindAsync(id);

            if (task == null)
            {
                return NotFound();
            }

            return task;
        }

        [HttpPost]
        public async System.Threading.Tasks.Task<ActionResult<Task>> PostTask(Task task)
        {
            _context.Tasks.Add(task);
            await _context.SaveChangesAsync();

            return CreatedAtAction("GetTask", new { id = task.TaskId }, task);
        }

        [HttpPut("{id}")]
		public async Task<IActionResult> PutTask(int id, Task task)
		{
			if (id != task.TaskId)
			{
				return BadRequest("Task ID mismatch.");
			}

			_context.Entry(task).State = EntityState.Modified;

			try
			{
				await _context.SaveChangesAsync();
			}
			catch (DbUpdateConcurrencyException)
			{
				if (!TaskExists(id))
				{
					return NotFound();
				}
				else
				{
					throw;
				}
			}

			return NoContent();
		}

        [HttpDelete("{id}")]
        public async System.Threading.Tasks.Task<IActionResult> DeleteTask(int id)
        {
            var task = await _context.Tasks.FindAsync(id);
            if (task == null)
            {
                return NotFound();
            }

            _context.Tasks.Remove(task);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private bool TaskExists(int id)
        {
            return _context.Tasks.Any(e => e.TaskId == id);
        }
    }
}
