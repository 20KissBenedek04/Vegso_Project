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
    /// Interaction logic for LoginWindow.xaml
    /// </summary>
    public partial class LoginWindow : Window
    {
        public LoginWindow()
        {
            InitializeComponent();
            EmailBox.Text = "admin@zoo.local";
            PasswordBox.Password = "admin123";
        }

        private async void Login_Click(object sender, RoutedEventArgs e)
        {
            ErrorText.Text = string.Empty;
            string email = EmailBox.Text.Trim();
            string password = PasswordBox.Password.Trim();
            if (string.IsNullOrEmpty(email) || string.IsNullOrEmpty(password))
            {
                ErrorText.Text = "Email és jelszó megadása kötelező";
                return;
            }
            LoginResponse? response = await ApiClient.LoginAsync(email, password);
            if(response == null || string.IsNullOrEmpty(response.Token))
            {
                ErrorText.Text = "Hibás bejelentkezési adatok";
                return;
            }
            Session.Token = response.Token;
            Session.UserName = response.Name;
            Session.UserRole = response.Role;
            Session.UserId = response.Id;
            MainWindow mainWindow = new MainWindow();
            mainWindow.Show();
            Close();
        }
    }
}
