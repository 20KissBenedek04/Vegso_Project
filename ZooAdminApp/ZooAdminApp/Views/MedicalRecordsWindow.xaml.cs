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
    /// Interaction logic for MedicalRecordsWindow.xaml
    /// </summary>
    public partial class MedicalRecordsWindow : Window
    {
        private List<AnimalDto> _animals;
        public MedicalRecordsWindow()
        {
            InitializeComponent();
            _ = InitAsync();
        }

        private async Task InitAsync()
        {
            _animals = await AnimalApi.GetAnimalsAsync() ?? new List<AnimalDto>();
            AnimalCombo.ItemsSource = _animals;
        }

        private async Task Load_Records()
        {
            if(AnimalCombo.SelectedValue is not int animalId)
            {
                return;
            }
            try
            {
                var records = await MedicalApi.GetAnimalRecordAsync(animalId) ?? new List<MedicalRecordDto>();
                Grid.ItemsSource = records;
            }
            catch (Exception x)
            {
                MessageBox.Show("Hiba a lekérdezésben: " + x.Message);
                
            }
            
        }

        private void Add_Click(object sender, RoutedEventArgs e)
        {
            if (AnimalCombo.SelectedValue is not int animalId)
            {
                return;
            }
            MedicalRecordFormWindow medicalRecordFormWindow = new MedicalRecordFormWindow(animalId);
            medicalRecordFormWindow.Owner = this;
            medicalRecordFormWindow.ShowDialog();
        }

        private void Grid_MouseDoubleClick(object sender, MouseEventArgs e)
        {

        }

        private void Load_Click(object sender, RoutedEventArgs e)
        {
            _ = Load_Records();
        }
    }
}
