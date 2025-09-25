using System.Windows;
using ZooAdminApp.Helper;
using ZooAdminApp.Views;

namespace ZooAdminApp
{
    /// <summary>
    /// Interaction logic for MainWindow.xaml
    /// </summary>
    public partial class MainWindow : Window
    {
        public MainWindow()
        {
            InitializeComponent();
            var userName = Session.UserName;
            var userRole = Session.UserRole;
            UserNameText.Text = userName;
            UserRoleText.Text = userRole;
            UsersBtn.IsEnabled = userRole is "admin";
            MedicalBtn.IsEnabled = userRole is "admin" or "vet";
            LogsBtn.IsEnabled = userRole is "admin";
            AnimalsBtn.IsEnabled = userRole is "admin";
        }

        private void Animals_Click(object sender, RoutedEventArgs e)
        {
            AnimalsWindow animalsWindow = new AnimalsWindow();
            animalsWindow.Owner = this;
            animalsWindow.ShowDialog();

        }

        private void Medical_Click(object sender, RoutedEventArgs e)
        {
            MedicalRecordsWindow medicalRecordsWindow = new MedicalRecordsWindow();
            medicalRecordsWindow.Owner = this;
            medicalRecordsWindow.ShowDialog();
        }

        private void Logout_Click(object sender, RoutedEventArgs e)
        {
            Session.Token = "";
            Session.UserName = "";
            Session.UserRole = "";
            Session.UserId = 0;
            LoginWindow loginWindow = new LoginWindow();
            loginWindow.Show();
            Close();
        }

        private void Users_Click(object sender, RoutedEventArgs e)
        {
            var role = Session.UserRole.ToLowerInvariant();
            if (role != "admin")
            {
                MessageBox.Show("A logok megtekintéséhez admin jogosultság szükséges.");
                return;
            }
            UsersWindow usersWindow = new UsersWindow();
            usersWindow.Owner = this;
            usersWindow.ShowDialog();
        }

        private void Logs_Click(object sender, RoutedEventArgs e)
        {
            var role = Session.UserRole.ToLowerInvariant();
            if (role != "admin")
            {
                MessageBox.Show("A logok megtekintéséhez admin jogosultság szükséges.");
                return;
            }
            LogsWindow logsWindow = new LogsWindow();
            logsWindow.Owner = this;
            logsWindow.ShowDialog();
        }
    }
}