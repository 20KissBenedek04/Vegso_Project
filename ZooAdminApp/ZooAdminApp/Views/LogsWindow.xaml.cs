using System.Threading.Tasks;
using System.Windows;
using ZooAdminApp.Api;
using ZooAdminApp.Helper;
using ZooAdminApp.Models;

namespace ZooAdminApp.Views
{
    /// <summary>
    /// Interaction logic for LogsWindow.xaml
    /// </summary>
    public partial class LogsWindow : Window
    {
        public LogsWindow()
        {
            InitializeComponent();

            Loaded += async (_, __) =>
            {
                try
                {
                    var logs = await LogsApi.GetLogsAsync() ?? new List<LogDto>();
                    Grid.ItemsSource = logs;
                }
                catch (Exception ex)
                {

                    MessageBox.Show("Nem sikerült betölteni a logokat: " + ex.Message);
                    Grid.ItemsSource = new List<LogDto>();
                }

            };
        }

    }
}
