const { contextBridge, ipcRenderer } = require("electron");

// Process
contextBridge.exposeInMainWorld('api', {
    load: () => {return ipcRenderer.send('load-mfc')},
    update: (id, json) => {return ipcRenderer.send('update-mfc', id, json)},
    metadata: (metadata) => {return ipcRenderer.send('metadata', metadata)},
    send: (channel, message) => {return ipcRenderer.send(channel, message)},
    on: (channel, message) => {return ipcRenderer.on(channel, message)},
    onReply: (message) => {return ipcRenderer.once('reply-message', message)},
})

// DOM
window.addEventListener('DOMContentLoaded', () => {
    
})