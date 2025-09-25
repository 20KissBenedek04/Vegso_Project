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

namespace ZooAdminApp.Views
{
    /// <summary>
    /// Interaction logic for UsersWindow.xaml
    /// </summary>
    public partial class UsersWindow : Window
    {
        public UsersWindow()
        {
            InitializeComponent();
            RoleCombo.SelectedIndex = 0;
        }

        private async void Create_Click(object sender, RoutedEventArgs e)
        {
            var name = NameBox.Text;
            var email = EmailBox.Text;
            var password = PasswordBox.Password;
            var role = (RoleCombo.SelectedItem as ComboBoxItem)?.Tag.ToString();

            if (string.IsNullOrEmpty(name) || string.IsNullOrEmpty(email) || string.IsNullOrEmpty(password) || string.IsNullOrEmpty(role))
            {
                MessageBox.Show("Név, email, jelszó, szerepkör megadása kötelező.");
                return;
            }

            var respone = await UserApi.CreateUserAsync(name, email, password, role!);
            if (respone is null)
            {
                MessageBox.Show("Sikertelen létrehozás!");
                return;
            }
            MessageBox.Show("Sikeres felhasználó létrehozás");
            DialogResult = true;
            Close();
        }

        private void Cancel_Click(object sender, RoutedEventArgs e)
        {

        }
    }
}
