const { app, BrowserWindow, Menu, shell, ipcMain, dialog, webContents } = require('electron');
const path = require('node:path');
const util = require('util');
const { ScrapeFunctions, links } = require('../scrapeData');
const { getNewData, updateItem } = require('./scripts/updateItem');

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
  return win;
};

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
};

function metadataWindow (metadata) {
  const father = BrowserWindow.getFocusedWindow();
  if (father) {
    const win = new BrowserWindow({
      width: 800,
      height: 450,
      icon: '../../../images/icons/mfc.ico',
      autoHideMenuBar: true,
      resizable: false,
      parent: father,
      modal: true,
      minimizable: false,
      webPreferences: {
        preload: path.join(__dirname, 'preload.js'),
        contextIsolation: true,
        nodeIntegration: false,
      },
    });
  
    win.loadFile('./metadata/metadata.html');
    setTimeout(() => {
      if (metadata[0] === undefined) {
        win.webContents.send('metadata-data', metadata);
      } else {
        win.webContents.send('metadata-update', metadata);
      };
    }, 150);
  };
};

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
];

app.whenReady().then(() => {
  const mainWindow = createWindow();

  const sc = new ScrapeFunctions();

  ipcMain.on('load-mfc', async (event) => {
    console.log('Fetching "mfc.json"...');
    let json = await sc.fetchJson();
    if (json) console.log('"mfc.json" carregado.' + String.fromCharCode(10) + '');

    event.reply('reply-message', json);
  });

  ipcMain.on('update-mfc', async (event, id, json) => {
    const promise = await getNewData(id, json);
    metadataWindow(promise);
  });

  ipcMain.on('update-new-metadata', async (event, [id, object, json]) => {
    const update = await updateItem(id, json, object);
    if (update) {
      console.log(`Item "${object.title}" updated on  "mfc.json".`);
      dialog.showMessageBox({
        type: 'info',
        title: 'Informação',
        message: 'Dados atualizados.',
        buttons: ['OK']
      });
      mainWindow.webContents.send('fetch-json-again', '');
    } else {
      dialog.showMessageBox({
        type: 'info',
        title: 'Informação',
        message: 'Nenhuma atualização foi feita.',
        buttons: ['OK']
      });
    };
  });

  ipcMain.on('renderer-message', (event, message) => {
    console.log(`Processo principal recebeu: "${message}"`);
  });

  ipcMain.on('metadata', async (event, metadata) => {
    console.log(`Showing metadata from item: ${metadata.title}`);
    metadataWindow(metadata);
  });

  ipcMain.on('href', (event, message) => {
    shell.openExternal(message);
  });

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
})