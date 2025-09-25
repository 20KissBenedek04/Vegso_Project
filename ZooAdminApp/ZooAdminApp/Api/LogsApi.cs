using ZooAdminApp.Models;

namespace ZooAdminApp.Api
{
    public static class LogsApi
    {
        public static Task<List<LogDto>?> GetLogsAsync() => ApiClient.GetAsync<List<LogDto>>("logs");
    }
}
