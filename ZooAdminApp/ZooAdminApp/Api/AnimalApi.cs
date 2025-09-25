using System;
using System.Collections.Generic;
using System.Linq;
using System.Net.Http;
using System.Net.Http.Json;
using System.Text;
using System.Threading.Tasks;
using System.Web;
using ZooAdminApp.Models;

namespace ZooAdminApp.Api
{
    public static class AnimalApi
    {
        public static async Task<List<AnimalDto>?> GetAnimalsAsync(string? query = null, int? speciesId = null, int? typeId = null, int? enclosureId = null)
        {
            ApiClient.ApplyAuth();
            var uriBuilder = new UriBuilder(new Uri(ApiClient.HttpClient.BaseAddress!, "animals"));
            var queryString = HttpUtility.ParseQueryString(string.Empty);
            if (!string.IsNullOrEmpty(query))
            {
                queryString["q"] = query;
            }
            if(speciesId != null)
            {
                queryString["speciesId"] = speciesId.Value.ToString();
            }
            if (typeId != null) 
            {
                queryString["typeId"] = typeId.Value.ToString();
            }
            if (enclosureId != null) 
            {
                queryString["enclosureId"] = enclosureId.Value.ToString();
            }
            if (!string.IsNullOrEmpty(queryString.ToString()))
            {

                uriBuilder.Query = queryString.ToString();
            }
            HttpResponseMessage? httpResponse = await ApiClient.HttpClient.GetAsync(uriBuilder.Uri);
            httpResponse.EnsureSuccessStatusCode();
            return await httpResponse.Content.ReadFromJsonAsync<List<AnimalDto>>();
        }

        public static Task<AnimalDto?> CreateAsync(AnimalCreateRequest request) => ApiClient.PostAsync<AnimalDto>("animals", request);
    }
}
