const { app, BrowserWindow, Menu, shell, ipcMain, dialog } = require('electron');
const path = require('node:path');
const util = require('util');
const { ScrapeFunctions, links } = require('../scrapeData');
const { updateItem } = require('./scripts/updateItem');

console.log('Processo principal.');
console.log(`Electron: ${process.versions.electron}`);

function createWindow() {
  const win = new BrowserWindow({
    width: 1080,
    height: 720,
    icon: '../../../images/icons/mfc.ico',
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      contextIsolation: true,
      nodeIntegration: false,
    },
  });

  Menu.setApplicationMenu(Menu.buildFromTemplate(template));

  win.loadFile('index.html');
  win.maximize();
}

function aboutWindow () {
  const father = BrowserWindow.getFocusedWindow();
  if (father) {
    const win = new BrowserWindow({
      width: 300,
      height: 125,
      icon: '../../../images/icons/mfc.ico',
      autoHideMenuBar: true,
      resizable: false,
      parent: father,
      modal: true,
    });
  
    win.loadFile('about.html');
  }
}

const template = [
  {
    label: 'Arquivo',
    submenu: [
      {
        label: 'Sair',
        click: () => {app.quit()},
        accelerator: 'Alt+F4'
      }
    ]
  },
  {
    label: 'Exibir',
    submenu: [
      {
        label: 'Recarregar',
        role: 'reload'
      },
      {
        label: 'Ferramentas de Desenvolvedor',
        role: 'toggleDevTools'
      },
      {
        type: 'separator'
      },
      {
        label: 'Aumentar',
        role: 'zoomIn'
      },
      {
        label: 'Diminuir',
        role: 'zoomOut'
      },
      {
        label: 'Restaurar',
        role: 'resetZoom'
      }
    ]
  },
  {
    label: 'Ajuda',
    submenu: [
      {
        label: 'Docs',
        click: () => {shell.openExternal('https://www.electronjs.org/pt/docs/latest/')}
      },
      {
        label: 'Sobre',
        click: () => {aboutWindow()}
      }
    ]
  }
]

app.whenReady().then(() => {
  createWindow();

  const sc = new ScrapeFunctions();

  ipcMain.on('load-mfc', async (event) => {
    console.log('Fetching "mfc.json"...');
    let json = await sc.fetchJson();
    if (json) console.log('"mfc.json" carregado.');

    event.reply('reply-message', json)
  });

  ipcMain.on('update-mfc', async (event, id, json) => {
    const promise = await updateItem(id, json);
    dialog.showMessageBox({
      type: 'info',
      title: 'Informação',
      message: JSON.stringify(promise).replaceAll('"',''),
    })
  })

  ipcMain.on('renderer-message', (event, message) => {
    console.log(`Processo principal recebeu: "${message}"`);
  })

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
})