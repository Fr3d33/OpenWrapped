# OpenWrapped

> Track your application usage and visualize your digital habits with beautiful, real-time statistics.

OpenWrapped is a lightweight, privacy-focused desktop application for Windows that monitors which applications you use and for how long. All data stays local on your machine - no telemetry, no cloud, no tracking.

## Features

- **Real-time Tracking** - Monitor active application usage with 1-second precision
- **Beautiful Visualizations** - View your usage statistics in colorful, interactive charts
- **Privacy First** - All data stored locally in SQLite, never leaves your machine
- **Lightweight** - Minimal resource footprint with background tracker
- **Auto-updating Dashboard** - Statistics refresh every 5 seconds
- **Portable** - Single installer, no dependencies required

## Architecture

OpenWrapped consists of three main components:

1. **Tracker** (Python) - Background process that monitors active windows
2. **Backend Server** (Flask) - REST API serving aggregated statistics
3. **Frontend** (Electron + React) - Desktop UI for data visualization

All components are compiled into standalone executables and packaged into a single Windows installer.

## Installation

### For Users

Download the latest `OpenWrapped Setup 1.0.0.exe` from the releases page and run it. The installer will:
- Install the application to `%LOCALAPPDATA%\Programs\openwrapped-electron\`
- Create desktop and start menu shortcuts
- Set up the database at `%LOCALAPPDATA%\OpenWrapped\openwrapped.db`

Launch OpenWrapped and the tracker will automatically start in a console window. The dashboard updates in real-time.

### For Developers

#### Prerequisites

- Python 3.11+
- Node.js 18+
- Windows 10/11

#### Setup

```bash
git clone https://github.com/Fr3d33/OpenWrapped.git
cd OpenWrapped
```

#### Install Dependencies

**Backend:**
```bash
cd backend
pip install -r requirements.txt
pip install pyinstaller
```

**Frontend:**
```bash
cd frontend
npm install
```

**Root:**
```bash
npm install
```

#### Development Mode

Start the backend server:
```bash
cd backend
python -m backend.api.server
```

Start the tracker (in a separate terminal):
```bash
python tracker.py
```

Start the frontend development server:
```bash
cd frontend
npm run dev
```

Access the dashboard at `http://localhost:5173`

## Building

To create a production build:

1. **Build Frontend:**
```bash
cd frontend
npm run build
```

2. **Compile Backend Executables:**
```bash
cd ../backend
python -m PyInstaller server.spec
python -m PyInstaller tracker.spec
```

3. **Package Application:**
```bash
cd ..
npm run package:win
```

The installer will be created at `dist/OpenWrapped Setup 1.0.0.exe`

## Database Schema

Database location: `%LOCALAPPDATA%\OpenWrapped\openwrapped.db`

**Table: `usage`**

| Column    | Type    | Description                          |
|-----------|---------|--------------------------------------|
| id        | INTEGER | Primary key (auto-increment)         |
| app       | TEXT    | Application executable name          |
| duration  | REAL    | Usage duration in seconds            |
| timestamp | TEXT    | ISO 8601 timestamp of recording      |

The database is automatically initialized on first run.

## Tech Stack

**Backend:**
- Python 3.11
- Flask + Flask-CORS
- SQLite3
- PyWin32 + psutil (Windows API access)
- PyInstaller (executable compilation)

**Frontend:**
- React 19
- TypeScript
- Vite
- Chart.js + react-chartjs-2
- CSS3 with custom animations

**Desktop:**
- Electron 39
- electron-builder (packaging)

## Project Structure

```
OpenWrapped/
├── backend/
│   ├── api/
│   │   └── server.py          # Flask REST API
│   ├── analytics/
│   │   └── aggregate.py       # Data aggregation logic
│   ├── collector/
│   │   └── windows.py         # Windows API integration
│   ├── storage/
│   │   └── db.py              # SQLite database layer
│   ├── tracker.py             # Main tracking application
│   ├── server.spec            # PyInstaller config (server)
│   └── tracker.spec           # PyInstaller config (tracker)
├── electron/
│   └── main.js                # Electron main process
├── frontend/
│   ├── src/
│   │   ├── App.tsx            # Root component
│   │   ├── Dashboard.tsx      # Main dashboard UI
│   │   └── main.tsx           # Entry point
│   └── vite.config.ts         # Vite configuration
└── package.json               # Electron builder config
```

## API Reference

**GET /stats**

Returns aggregated usage statistics sorted by total duration (descending).

Response:
```json
[
  ["Chrome.exe", 3600.5],
  ["Code.exe", 2400.3],
  ["explorer.exe", 180.1]
]
```

Format: `[application_name, total_seconds]`

## Troubleshooting

**Tracker window closes immediately:**
- Check the console output for errors
- Ensure PyWin32 dependencies are installed
- Run tracker manually from terminal to see error messages

**No data showing in dashboard:**
- Verify the tracker console window is open and running
- Check that backend server started successfully
- Confirm database exists at `%LOCALAPPDATA%\OpenWrapped\openwrapped.db`
- Try accessing `http://localhost:8000/stats` directly in browser

**Build fails:**
- Ensure all node_modules and Python packages are installed
- Delete `dist/` folder and rebuild
- Check that no OpenWrapped processes are running

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request. For major changes, please open an issue first to discuss what you would like to change.

## License

This project is open source and available under the MIT License.

## Acknowledgments

Built with passion for understanding our digital habits and reclaiming our time.

