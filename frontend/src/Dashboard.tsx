import { Bar } from 'react-chartjs-2';
import { useEffect, useState } from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';
import './Dashboard.css';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

export default function Dashboard() {
  const [data, setData] = useState<[string, number][]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdate, setLastUpdate] = useState<Date | null>(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await fetch('http://localhost:8000/stats');
        if (!res.ok) throw new Error('Server not responding');
        const stats = await res.json();
        setData(stats);
        setError(null);
        setLastUpdate(new Date());
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Error loading data');
        console.error('API Error:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
    const interval = setInterval(fetchStats, 5000);
    return () => clearInterval(interval);
  }, []);

  if (loading) {
    return (
      <div className="loading">
        <div className="spinner"></div>
        <p>Loading data...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="error">
        <h2>⚠️ Error</h2>
        <p>{error}</p>
        <p className="hint">Make sure the backend server is running (localhost:8000)</p>
      </div>
    );
  }

  if (data.length === 0) {
    return (
      <div className="empty">
        <h2>📭 No Data</h2>
        <p>Start the tracker app to collect data</p>
      </div>
    );
  }

  const totalMinutes = data.reduce((sum, item) => sum + item[1] / 60, 0);
  const topApp = data[0];

  // Function to clean up app names
  const cleanAppName = (name: string): string => {
    return name
      .replace('.exe', '')           // Remove .exe
      .replace(/\.(Root|WinUI3|Store|WindowsTerminal)$/i, '')  // Remove suffixes like .Root, .WinUI3, etc.
      .replace(/\.[\w]+$/, '')        // Remove other dot suffixes
      .split('\\').pop()              // For paths, only use filename
      || name;
  };

  const chartData = {
    labels: data.map(item => cleanAppName(item[0])),
    datasets: [{
      label: 'Usage Duration (Minutes)',
      data: data.map(item => Math.round((item[1] / 60) * 10) / 10),
      backgroundColor: '#1a1a1a',
      borderColor: '#1a1a1a',
      borderWidth: 0,
      borderRadius: 15,
      barThickness: 40,
    }]
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false
      },
      title: {
        display: true,
        text: 'MOST USED APPLICATIONS',
        font: {
          size: 20,
          weight: 'bold' as const,
          family: "-apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif"
        },
        padding: 25,
        color: '#1a1a1a'
      },
      tooltip: {
        backgroundColor: '#1a1a1a',
        titleColor: '#fff',
        bodyColor: '#fff',
        padding: 12,
        cornerRadius: 10,
        titleFont: {
          size: 14,
          weight: 'bold' as const
        },
        bodyFont: {
          size: 13
        },
        callbacks: {
          label: (context: any) => {
            const minutes = context.parsed.y;
            const hours = Math.floor(minutes / 60);
            const mins = Math.round(minutes % 60);
            return hours > 0 
              ? `  ${hours}h ${mins}m`
              : `  ${mins} minutes`;
          }
        }
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          callback: (value: string | number) => `${value}m`,
          font: {
            size: 12,
            weight: 'bold' as const
          },
          color: '#1a1a1a'
        },
        grid: {
          color: '#E8DCC8',
          lineWidth: 2
        },
        border: {
          display: true,
          color: '#1a1a1a',
          width: 3
        }
      },
      x: {
        ticks: {
          font: {
            size: 12,
            weight: 'bold' as const
          },
          color: '#1a1a1a'
        },
        grid: {
          display: false
        },
        border: {
          display: true,
          color: '#1a1a1a',
          width: 3
        }
      }
    }
  };

  return (
    <div className="dashboard">
      <div className="stats-cards">
        <div className="stat-card">
          <h3>📱 Applications</h3>
          <p className="stat-value">{data.length}</p>
        </div>
        <div className="stat-card">
          <h3>⏱️ Total Time</h3>
          <p className="stat-value">
            {Math.floor(totalMinutes / 60)}h {Math.round(totalMinutes % 60)}m
          </p>
        </div>
        <div className="stat-card highlight">
          <h3>🏆 Top App</h3>
          <p className="stat-value">{cleanAppName(topApp[0])}</p>
          <p className="stat-detail">
            {Math.round((topApp[1] / 60) * 10) / 10} min
          </p>
        </div>
      </div>

      <div className="chart-container">
        <Bar data={chartData} options={chartOptions} />
      </div>

      {lastUpdate && (
        <div className="last-update">
          Last update: {lastUpdate.toLocaleTimeString('en-US')}
        </div>
      )}
    </div>
  );
}
