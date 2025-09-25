using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Text.Json.Serialization;
using System.Threading.Tasks;

namespace ZooAdminApp.Models
{
    public class AnimalDto
    {
        [JsonPropertyName("id")]
        public int Id { get; set; }

        [JsonPropertyName("name")]
        public string Name { get; set; }

        [JsonPropertyName("birthDate")]
        public string BirthDate {  get; set; }

        [JsonPropertyName("weight")]
        public double Weight {  get; set; }

        [JsonPropertyName("imageUrl")]
        public string ImageUrl {  get; set; }

        [JsonPropertyName("isActive")]
        public bool IsActive { get; set; }

        [JsonPropertyName("species")]
        public SpeciesDto? Species { get; set; }

        [JsonPropertyName("type")]
        public AnimalTypeDto? Type { get; set; }

        [JsonPropertyName("enclosure")]
        public EnclosureDto? Enclosure { get; set; }
    }
    public class SpeciesDto
    {
        [JsonPropertyName("id")]
        public int Id { get; set; }

        [JsonPropertyName("latinName")]
        public string LatinName {  get; set; }
    }

    public class AnimalTypeDto
    {
        [JsonPropertyName("id")]
        public int Id { get; set; }

        [JsonPropertyName ("name")]
        public string Name { get; set; }
    }

    public class EnclosureDto 
    {
        [JsonPropertyName("id")]
        public int Id { get; set; }

        [JsonPropertyName("name")]
        public string Name { get; set; }

        [JsonPropertyName("description")]
        public string Description { get; set; }
    }

    public class AnimalCreateRequest
    {
        [JsonPropertyName("name")]
        public string Name { get; set; }

        [JsonPropertyName("speciesId")]
        public int SpeciesId { get; set; }

        [JsonPropertyName("typeId")]
        public int TypeId { get; set; }

        [JsonPropertyName("enclosureId")]
        public int EnclosureId {  get; set; }

        [JsonPropertyName("birthDate")]
        public string BirthDate {  get; set; }

        [JsonPropertyName("weight")]
        public double Weight{ get; set; }

        [JsonPropertyName("isActive")]
        public bool IsActive {  get; set; }

        [JsonPropertyName("imageUrl")]
        public string ImageUrl {  get; set; }
    }
}
