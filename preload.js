const { contextBridge, ipcRenderer } = require('electron');

// Expose a safe bridge object to the renderer's window
contextBridge.exposeInMainWorld('electronAPI', {
    // Expose ONLY the send function, limiting what the renderer can do
    openNewView: (type) => ipcRenderer.send('open-new-view', type)
});

// The rest of your preload script (if any)