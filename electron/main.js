const { app, BrowserWindow } = require("electron");
const path = require("path");
const { spawn } = require("child_process");

let mainWindow;
let backendProcess;
let trackerProcess;

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
    },
  });

  const isDev = !app.isPackaged;
  const indexPath = isDev
    ? path.join(__dirname, "../frontend/dist/index.html")
    : path.join(process.resourcesPath, "app.asar/frontend/dist/index.html");

  mainWindow.loadFile(indexPath);

  if (isDev) {
    mainWindow.webContents.openDevTools();
  }

  mainWindow.on("closed", () => {
    mainWindow = null;
    if (backendProcess) backendProcess.kill();
  });
}

app.whenReady().then(() => {
  // Backend starten
  const isDev = !app.isPackaged;
  const backendExe = isDev
    ? path.join(__dirname, "../backend/dist/server.exe")
    : path.join(
        process.resourcesPath,
        "app.asar.unpacked/backend/dist/server.exe",
      );

  console.log("Starting backend:", backendExe);

  backendProcess = spawn(backendExe, [], {
    detached: false,
    stdio: "pipe",
  });

  backendProcess.stdout.on("data", (data) => {
    console.log(`Backend: ${data}`);
  });

  backendProcess.stderr.on("data", (data) => {
    console.error(`Backend Error: ${data}`);
  });

  backendProcess.on("error", (error) => {
    console.error("Failed to start backend:", error);
  });
  // Tracker starten mit eigenem Fenster
  const trackerExe = isDev
    ? path.join(__dirname, "../backend/dist/tracker.exe")
    : path.join(
        process.resourcesPath,
        "app.asar.unpacked/backend/dist/tracker.exe",
      );

  console.log("Starting tracker:", trackerExe);

  // Verwende cmd.exe, um ein neues sichtbares Fenster zu erzwingen
  trackerProcess = spawn("cmd.exe", ["/K", `"${trackerExe}"`], {
    detached: true,
    shell: false,
    windowsVerbatimArguments: true,
  });

  trackerProcess.unref();

  trackerProcess.on("error", (error) => {
    console.error("Failed to start tracker:", error);
  });

  //
  // Warte kurz, bevor das Fenster geöffnet wird
  setTimeout(createWindow, 2000);
});

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") app.quit();
});
