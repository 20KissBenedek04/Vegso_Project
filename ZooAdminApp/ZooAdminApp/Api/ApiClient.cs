using System.Net.Http;
using System.Net.Http.Headers;
using System.Net.Http.Json;
using System.Text.Json;
using ZooAdminApp.Helper;
using ZooAdminApp.Models;

namespace ZooAdminApp.Api
{
    public static class ApiClient
    {
        public static HttpClient HttpClient { get; }
        private static readonly JsonSerializerOptions JsonOptions = new()
        {
            PropertyNameCaseInsensitive = true,
            DefaultIgnoreCondition = System.Text.Json.Serialization.JsonIgnoreCondition.WhenWritingNull
        };
        static ApiClient()
        {
            HttpClient = new HttpClient()
            {
                BaseAddress = new Uri("http://localhost:3000/api/")
            };
            HttpClient.DefaultRequestHeaders.Accept.Clear();
            HttpClient.DefaultRequestHeaders.Accept.Add(new System.Net.Http.Headers.MediaTypeWithQualityHeaderValue("application/json"));
        }

        public static async Task<LoginResponse?> LoginAsync(string email, string password)
        {
            var payload = new { email, password };
            HttpResponseMessage? response = await HttpClient.PostAsJsonAsync("auth/login", payload);
            if (!response.IsSuccessStatusCode)
            {
                return null;
            }
            return await response.Content.ReadFromJsonAsync<LoginResponse>(JsonOptions);
        }

        public static void ApplyAuth()
        {
            HttpClient.DefaultRequestHeaders.Clear();
            HttpClient.DefaultRequestHeaders.Accept.Add(new System.Net.Http.Headers.MediaTypeWithQualityHeaderValue("application/json"));
            if (!string.IsNullOrEmpty(Session.Token))
            {
                HttpClient.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", Session.Token);
            }
        }

        public static async Task<T?> GetAsync<T>(string url)
        {
            ApplyAuth();
            HttpResponseMessage? responseMessage = await HttpClient.GetAsync(url);
            responseMessage.EnsureSuccessStatusCode();
            return await responseMessage.Content.ReadFromJsonAsync<T>(JsonOptions);
        }

        public static async Task<T?> PostAsync<T>(string url, object body)
        {
            ApplyAuth();
            HttpResponseMessage? responseMessage = await HttpClient.PostAsJsonAsync(url, body, JsonOptions);
            responseMessage.EnsureSuccessStatusCode();
            return await responseMessage.Content.ReadFromJsonAsync<T>(JsonOptions);
        }
    }
}
