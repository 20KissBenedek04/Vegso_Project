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
using ZooAdminApp.Helper;
using ZooAdminApp.Models;

namespace ZooAdminApp.Views
{
    /// <summary>
    /// Interaction logic for AnimalFormWindow.xaml
    /// </summary>
    public partial class AnimalFormWindow : Window
    {
        private readonly AnimalDto? _existingAnimal;
        private readonly List<SpeciesDto> _speciesList;
        private readonly List<AnimalTypeDto> _animalTypeList;
        private readonly List<EnclosureDto> _enclosureList;
        public AnimalFormWindow(List<SpeciesDto> species, List<AnimalTypeDto> animalType, List<EnclosureDto> enclosure, AnimalDto? existingAnimal)
        {
            InitializeComponent();
            _speciesList = species;
            _animalTypeList = animalType;
            _enclosureList = enclosure;
            _existingAnimal = existingAnimal;
            SpeciesCombo.ItemsSource = _speciesList;
            TypeCombo.ItemsSource = _animalTypeList;
            EnclosureCombo.ItemsSource= _enclosureList;
        }


        private async void Save_Click(object sender, RoutedEventArgs e)
        {
            try
            {
                string role = Session.UserRole;
                AnimalCreateRequest request = new AnimalCreateRequest()
                {
                    Name = NameBox.Text,
                    SpeciesId = (int)SpeciesCombo.SelectedValue,
                    TypeId = (int)TypeCombo.SelectedValue,
                    EnclosureId = (int)EnclosureCombo.SelectedValue,
                    BirthDate = BirthBox.Text,
                    Weight = Double.Parse(WeightBox.Text),
                    IsActive = ActiveBox.IsChecked == true,
                    ImageUrl = ImageBox.Text,
                };
                AnimalDto? createdAnimal = await AnimalApi.CreateAsync(request);
                if (createdAnimal == null) 
                {
                    MessageBox.Show("Sikertelen mentés");
                    return;
                }
                DialogResult = true;
                Close();
            }
            catch (Exception ex)
            {

                MessageBox.Show($"Hiba a mentés közben: {ex.Message}");
            }
        }

        private void Cancel_Click(object sender, RoutedEventArgs e)
        {

        }
    }
}
