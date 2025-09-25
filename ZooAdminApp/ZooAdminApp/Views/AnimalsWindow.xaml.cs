using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Windows;
using System.Windows.Controls;
using System.Windows.Data;
using System.Windows.Documents;
using System.Windows.Input;
using System.Windows.Media;
using System.Windows.Media.Imaging;
using System.Windows.Shapes;
using ZooAdminApp.Api;
using ZooAdminApp.Models;

namespace ZooAdminApp.Views
{
    /// <summary>
    /// Interaction logic for AnimalsWindow.xaml
    /// </summary>
    public partial class AnimalsWindow : Window
    {
        private List<SpeciesDto> _speciesList;
        private List<AnimalTypeDto> _animalTypeList;
        private List<EnclosureDto> _enclosureList;
        public AnimalsWindow()
        {
            InitializeComponent();
            Loaded += async (_, __) => await InitAsync();
        }
        private async Task InitAsync()
        {
            _speciesList = await LookUp.GetSpeciesAsync() ?? new List<SpeciesDto>();
            _animalTypeList = await LookUp.GetAnimalTypeAsync() ?? new List<AnimalTypeDto>();
            _enclosureList = await LookUp.GetEnclosureAsync() ?? new List<EnclosureDto>();
            SpeciesCombo.ItemsSource = _speciesList;
            TypeCombo.ItemsSource = _animalTypeList;
            EnclosureCombo.ItemsSource = _enclosureList;
            await AnimalLoadAsync();
        }
        private async Task AnimalLoadAsync()
        {
            string? query = string.IsNullOrEmpty(SearchBox.Text) ? null : SearchBox.Text;
            int? speciesId = SpeciesCombo.SelectedValue as int?;
            int? typeId = TypeCombo.SelectedValue as int?;
            int? enclosureId = EnclosureCombo.SelectedValue as int?;
            List<AnimalDto>? animalDtos = await AnimalApi.GetAnimalsAsync(query, speciesId, typeId, enclosureId) ?? [];
            Grid.ItemsSource = animalDtos;

        }

        private void Search_Click(object sender, RoutedEventArgs e)
        {
            _ = AnimalLoadAsync();
        }

        private void Add_Click(object sender, RoutedEventArgs e)
        {
            AnimalFormWindow animalWindow = new AnimalFormWindow(_speciesList, _animalTypeList, _enclosureList, null);
            animalWindow.Owner = this;
            if(animalWindow.ShowDialog() == true)
            {
                _ = AnimalLoadAsync();
            }
        }

        private void Grid_MouseDoubleClick(object sender, MouseEventArgs e)
        {

        }
    }
}
