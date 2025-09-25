using System.Text.Json.Serialization;

namespace ZooAdminApp.Models
{
    public class LoginResponse
    {
        [JsonPropertyName("id")]
        public int Id { get; set; }
        [JsonPropertyName("name")]
        public string Name { get; set; }

        [JsonPropertyName("email")]
        public string Email { get; set; }

        [JsonPropertyName("role")]
        public string Role { get; set; }

        [JsonPropertyName("token")]
        public string Token { get; set; }

    }
}
