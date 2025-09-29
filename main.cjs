const { app, BrowserWindow } = require("electron");
const path = require("path");
const server = require("./server.cjs");

const userDataPath = app.getPath('userData'); 
console.log(`User Data Path defined as: ${userDataPath}`);


let mainWindow;

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: true,

   
    },
  });

  // Start your server first
  server.start(userDataPath, () => {
    console.log("Server running at http://localhost:3000");
    mainWindow.loadURL("http://localhost:3000");
  });

  mainWindow.on("closed", () => {
    mainWindow = null;
  });
  mainWindow.webContents.openDevTools();
}



app.whenReady().then(createWindow);

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") app.quit();
});
