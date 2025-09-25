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
    /// Interaction logic for MedicalRecordFormWindow.xaml
    /// </summary>
    public partial class MedicalRecordFormWindow : Window
    {
        private readonly int _animalId;
        private List<EnclosureDto> _enclosures;
        public MedicalRecordFormWindow(int animalId)
        {
            InitializeComponent();
            _ = InitAsync();
            _animalId = animalId;
        }

        private async Task InitAsync()
        {
            _enclosures = await LookUp.GetEnclosureAsync();
            EnclosureCombo.ItemsSource = _enclosures;
        }

        private async void Save_Click(object sender, RoutedEventArgs e)
        {
            double weight = double.Parse(WeightBox.Text);
            string? enclosureName = EnclosureCombo.SelectedValue as string;
            string description = DescBox.Text;
            var medicalCreateRequest = new MedicalCreateRequest()
            {
                Description = description,
                Enclosure = enclosureName ?? string.Empty,
                Weight = weight
            };
            var createdMedicalRecord = await MedicalApi.CreateAnimalRecord(_animalId, medicalCreateRequest);
            if (createdMedicalRecord == null)
            {
                MessageBox.Show("Sikertelen mentés!");
                return;
            }
            DialogResult = true;
            Close();
        }

        private void Cancel_Click(object sender, RoutedEventArgs e)
        {

        }

        
    }
}
