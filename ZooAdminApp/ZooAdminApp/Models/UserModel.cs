using System.Text.Json.Serialization;

namespace ZooAdminApp.Models
{
    public class UserModel
    {
        [JsonPropertyName("id")]
        public int Id { get; set; }

        [JsonPropertyName("name")]
        public string Name { get; set; }

        [JsonPropertyName("email")]
        public string Email { get; set; }
    }
}
