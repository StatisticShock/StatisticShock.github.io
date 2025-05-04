const { contextBridge, ipcRenderer } = require("electron");

// Process
contextBridge.exposeInMainWorld('api', {
    load: () => {return ipcRenderer.send('load-mfc')},
    update: (id, json) => {return ipcRenderer.send('update-mfc', id, json)},
    send: (message) => {return ipcRenderer.send('renderer-message', message)},
    on: (message) => {return ipcRenderer.on('main-message', message)},
    onReply: (message) => {return ipcRenderer.on('reply-message', message)},
})

// DOM
window.addEventListener('DOMContentLoaded', () => {
    
})