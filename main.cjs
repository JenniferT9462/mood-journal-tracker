// main.js

const { app, BrowserWindow } = require('electron');
const path = require('path');

// 1. Start your Express server
// Assuming your Express entry file is in the root and named 'server.js'
// Adjust the path below if your server file is named differently or is in a subdirectory.
const server = require('./server.cjs'); // or require('./app')
const port = 3000; // Use a specific port for the internal server

let mainWindow;

// MODIFIED main file (main.js or main.cjs)
// Example of your main file (main.js or main.cjs)
function createWindow() {
  const mainWindow = new BrowserWindow({
    // ... window settings ...
    webPreferences: {
      // KEEP nodeIntegration: true, contextIsolation: false, webSecurity: false 
      // for now until the app is working correctly.
    }
  });

  // 🛑 CRITICAL FIX: Load the URL served by Express, not the local file path.
  mainWindow.loadURL('http://localhost:3000'); 
  
  mainWindow.webContents.openDevTools(); 
}

// This method will be called when Electron has finished initialization
app.whenReady().then(() => {
    // Start Express and then create the window when it's ready
    server.listen(port, () => {
        console.log(`Express server running on port ${port}`);
        createWindow();
    });

  app.on('activate', function () {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

// Quit when all windows are closed, except on macOS
app.on('window-all-closed', function () {
  if (process.platform !== 'darwin') app.quit();
});