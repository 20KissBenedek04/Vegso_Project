using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Text.Json.Serialization;
using System.Threading.Tasks;

namespace ZooAdminApp.Models
{
    public class MedicalRecordDto
    {
        [JsonPropertyName("id")]
        public int Id {  get; set; }

        [JsonPropertyName("description")]
        public string Description {  get; set; }

        [JsonPropertyName("weight")]
        public double Weight {  get; set; }

        [JsonPropertyName("enclosure")]
        public string Enclosure { get; set; }

        [JsonPropertyName("createdAt")]
        public string CreatedAt {  get; set; }

        [JsonPropertyName("updatedAt")]
        public string UpdatedAt { get; set; }

        [JsonPropertyName("vetId")]
        public int VetId { get; set; }

        [JsonPropertyName("animalId")]
        public int AnimalId { get; set; }

        [JsonPropertyName("vet")]
        public UserModel Vet { get; set; }
    }

    public class MedicalCreateRequest
    {
        public string Description { get; set; }
        public double? Weight { get; set; }
        public string Enclosure { get; set; }
    }
}
