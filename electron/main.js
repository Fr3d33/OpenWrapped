const { app, BrowserWindow } = require("electron"); // ✔ BrowserWindow korrigiert
const path = require("path");
const { spawn } = require("child_process");

let mainWindow;
let backendProcess;

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
    },
  });

  mainWindow.loadFile(path.join(__dirname, "../frontend/dist/index.html"));

  mainWindow.on("closed", () => {
    mainWindow = null;
    if (backendProcess) backendProcess.kill();
  });
}

app.whenReady().then(() => {
  // Backend starten
  const backendExe = path.join(__dirname, "../backend/dist/server.exe");
  backendProcess = spawn(backendExe, [], { detached: true, stdio: "ignore" });
  backendProcess.unref();

  createWindow();
});

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") app.quit();
});
