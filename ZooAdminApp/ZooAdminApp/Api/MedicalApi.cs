using ZooAdminApp.Models;

namespace ZooAdminApp.Api
{
    public static class MedicalApi
    {
        public static Task<List<MedicalRecordDto>?> GetAnimalRecordAsync(int animalId) => ApiClient.GetAsync<List<MedicalRecordDto>>($"animals/{animalId}/records");

        public static Task<MedicalRecordDto?> CreateAnimalRecord(int animalId, MedicalCreateRequest body) => ApiClient.PostAsync<MedicalRecordDto>($"animals/{animalId}/records", body);
    }
}
