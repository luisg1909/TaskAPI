using System;
using System.ComponentModel.DataAnnotations;

namespace TaskAPI.Models
{
    public class Task
    {
        public int TaskId { get; set; }

        [Required]
        [StringLength(255)]
        public string Title { get; set; }

        public string Description { get; set; }

        [Range(1, 5)]
        public int Priority { get; set; }

        public DateTime? DueDate { get; set; }

        [Required]
        [StringLength(50)]
        public string Status { get; set; }
    }
}
