# OpenWrapped

OpenWrapped is an app usage tracker for Windows. It consists of a Python backend that tracks active app usage and stores the data in a SQLite database, as well as an Electron frontend with React for displaying the data.

## Features

- Tracks active applications on Windows
- Stores usage data in a SQLite database
- Clean Electron + React frontend
- Windows installer via Electron-Builder

## Installation

### Prerequisites

- Python 3.10+
- Node.js 18+ / npm
- Electron
- SQLite3 (optional, for direct DB testing)

### Clone Repository

```bash
git clone https://github.com/yourusername/OpenWrapped.git
cd OpenWrapped
```

### Start Backend

```bash
cd backend
python -m venv venv
.\venv\Scripts\activate   # Windows
pip install -r requirements.txt
cd ..
<your-directory>/OpenWrapped/.venv/Scripts/python.exe -m backend.api.server # Erststart: DB wird automatisch erstellt
```

**Hinweis:** Die Datenbank `openwrapped.db` wird automatisch erstellt und sollte **nicht** ins Repository gepusht werden.

### Start Frontend

```bash
cd ../frontend
npm install
npm run dev
```

The frontend will then run at `http://localhost:5173`.

## Production / Create Installer

1. Alle OpenWrapped-Prozesse beenden.
2. Alte Builds löschen:

```powershell
Remove-Item -Recurse -Force .\dist
```

3. Build starten:

```bash
npm install
npx electron-builder --win nsis
```

Der Installer wird im Ordner `dist/` erstellt (z.B. `OpenWrapped Setup.exe`).

## Database Structure

File: `openwrapped.db`
Table: `usage`

| Column    | Type    | Description           |
| --------- | ------- | --------------------- |
| id        | INTEGER | Primary key           |
| app       | TEXT    | Application name      |
| duration  | REAL    | Usage in seconds      |
| timestamp | TEXT    | Recording timestamp   |

The database is initialized automatically by the backend.

## GitHub Setup

* `.gitignore` should contain the following files/folders:

  * `openwrapped.db`
  * `dist/`
  * `node_modules/`
  * `__pycache__/`

## Troubleshooting

* **BrowserWindow is not defined** → Check for typos in `main.js`: `const { app, BrowserWindow } = require('electron');`
* **App won't start / exe is blocked** → Close all Electron/Node processes, restart if necessary, then start build again.
* **Database access** → Make sure `openwrapped.db` is found by the backend or initialize it with `init_db()`.

