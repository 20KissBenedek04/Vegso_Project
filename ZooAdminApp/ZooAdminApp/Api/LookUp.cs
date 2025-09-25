using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using ZooAdminApp.Models;

namespace ZooAdminApp.Api
{
    public static class LookUp
    {
        public static Task<List<SpeciesDto>?> GetSpeciesAsync() => ApiClient.GetAsync<List<SpeciesDto>>("species");
        public static Task<List<AnimalTypeDto>?> GetAnimalTypeAsync() => ApiClient.GetAsync<List<AnimalTypeDto>>("animaltypes");
        public static Task<List<EnclosureDto>?> GetEnclosureAsync() => ApiClient.GetAsync<List<EnclosureDto>>("enclosure");
    }
}
