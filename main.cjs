const { app, BrowserWindow } = require("electron");
const path = require("path");
const server = require("./server.cjs");
const port = 3000;

app.disableHardwareAcceleration();

let mainWindow;

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    focusable: true,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
      backgroundThrottling: false,
      webSecurity: false, // Optional, but sometimes helps with localhost issues
      offscreen: false,
    },
  });

  mainWindow.loadURL(`http://localhost:${port}/`);

  mainWindow.once("ready-to-show", () => {
    mainWindow.show();
  });

 

  mainWindow.on("restore", () => {
    mainWindow.focus();
    mainWindow.webContents.focus();
  });


}

app.whenReady().then(() => {
  server.start(() => {
    console.log("Server started");
    createWindow();
  });

  app.on("activate", function () {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

app.on("window-all-closed", function () {
  if (process.platform !== "darwin") app.quit();
});
