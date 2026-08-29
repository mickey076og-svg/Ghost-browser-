const { app, BrowserWindow, session } = require('electron');
const fetch = require('cross-fetch');

let mainWindow;

async function createWindow() {
  // Load Adblocker - blocks 100k+ ads
  const { ElectronBlocker } = await import('@cliqz/adblocker-electron');
  const blocker = await ElectronBlocker.fromPrebuiltAdsAndTracking(fetch);
  
  blocker.enableBlockingInSession(session.defaultSession);
  console.log("✅ Ghost Browser: Adblock active");

  // Create browser window
  mainWindow = new BrowserWindow({
    width: 1366,
    height: 800,
    title: "Ghost Browser - Ad Free",
    icon: "icon.png",
    autoHideMenuBar: true,
    backgroundColor: "#121212",
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      webviewTag: true
    }
  });

  // Load your UI - change to Google if out folder not built yet
  mainWindow.loadURL('https://www.google.com');
  
  // Optional: Open DevTools
  // mainWindow.webContents.openDevTools();

  mainWindow.on('closed', () => {
    mainWindow = null;
  });
}

// App start
app.whenReady().then(createWindow);

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  if (mainWindow === null) {
    createWindow();
  }
});
