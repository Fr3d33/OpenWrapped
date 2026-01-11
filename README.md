# OpenWrapped

OpenWrapped ist ein App-Usage-Tracker für Windows. Es besteht aus einem Python-Backend, das die Nutzung aktiver Apps trackt und die Daten in einer SQLite-Datenbank speichert, sowie einem Electron-Frontend mit React zur Anzeige der Daten.

## Features

- Trackt aktive Anwendungen auf Windows
- Speichert Nutzungsdaten in einer SQLite-Datenbank
- Übersichtliches Electron + React Frontend
- Windows Installer via Electron-Builder

## Installation

### Voraussetzungen

- Python 3.10+
- Node.js 18+ / npm
- Electron
- SQLite3 (optional, für direkte DB-Tests)

### Repository klonen

```bash
git clone https://github.com/deinusername/OpenWrapped.git
cd OpenWrapped
````

### Backend starten

```bash
cd backend
python -m venv venv
.\venv\Scripts\activate   # Windows
pip install -r requirements.txt
python main.py            # Erststart: DB wird automatisch erstellt
```

**Hinweis:** Die Datenbank `openwrapped.db` wird automatisch erstellt und sollte **nicht** ins Repository gepusht werden.

### Frontend starten

```bash
cd ../frontend
npm install
npm run dev
```

Das Frontend läuft dann unter `http://localhost:5173`.

## Produktion / Installer erstellen

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

## Datenbankstruktur

Datei: `openwrapped.db`
Tabelle: `usage`

| Spalte    | Typ     | Beschreibung               |
| --------- | ------- | -------------------------- |
| id        | INTEGER | Primärschlüssel            |
| app       | TEXT    | Name der Anwendung         |
| duration  | REAL    | Nutzung in Sekunden        |
| timestamp | TEXT    | Zeitpunkt der Aufzeichnung |

Die Datenbank wird automatisch vom Backend initialisiert.

## GitHub Setup

* `.gitignore` sollte folgende Dateien/Ordner enthalten:

  * `openwrapped.db`
  * `dist/`
  * `node_modules/`
  * `__pycache__/`

## Troubleshooting

* **BrowserWindow is not defined** → Prüfe Tippfehler in `main.js`: `const { app, BrowserWindow } = require('electron');`
* **App startet nicht / exe wird gesperrt** → Alle Electron/Node-Prozesse beenden, ggf. Neustart, dann Build erneut starten.
* **Datenbankzugriff** → Stelle sicher, dass `openwrapped.db` vom Backend gefunden wird oder initialisiere sie mit `init_db()`.

