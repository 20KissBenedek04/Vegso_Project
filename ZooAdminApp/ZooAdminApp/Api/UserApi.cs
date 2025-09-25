namespace ZooAdminApp.Api
{
    public static class UserApi
    {
        public static Task<object?> CreateUserAsync(string name, string email, string password, string role)
        {
            var body = new { name, email, password, role };
            return ApiClient.PostAsync<object>("admin/users", body);
        }
    }
}
