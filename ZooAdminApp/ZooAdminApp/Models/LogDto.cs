namespace ZooAdminApp.Models
{
    public class LogDto
    {
        public int Id { get; set; }
        public string Action { get; set; }
        public string TargetType { get; set; }
        public int TargetId { get; set; }
        
        public int UserId { get; set; }

        public DateTime Timestamp { get; set; }
    }
}
