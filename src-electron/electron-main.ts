import { app, BrowserWindow, Tray, Menu, nativeTheme, nativeImage, ipcMain } from 'electron'
import { parse } from 'yaml'
import path from 'path'
import os from 'os'
import fs from 'fs';

const platform = process.platform || os.platform()

try {
  if (platform === 'win32' && nativeTheme.shouldUseDarkColors) {
    fs.unlinkSync(
      path.join(app.getPath('userData'), 'DevTools Extensions')
    )
  }
} catch (_) {}

interface AppWindows {
  [key: string]: BrowserWindow
}

let mainTray: Tray | undefined
let appWindows:AppWindows = {}

function createTray (): void {
  /**
   * Initial tray options
   */

  let icon = nativeImage.createFromPath(path.resolve(__dirname, 'icons/icon.png'))
  icon = icon.resize({ height: 16, width: 16 })

  mainTray = new Tray(icon)
  const trayMenu = Menu.buildFromTemplate([
    {'label': 'Show Dashboard', 'type': 'normal', 'click': createMainWindow},
    {'label': 'Hide Dashboard', 'type': 'normal', 'click': destroyMainWindow}
  ])
  mainTray.setToolTip('HydroLoader Desktop');
  mainTray.setContextMenu(trayMenu);
}

function createMainWindow (): void {
  /**
   * Initial window options
   */

  if ('main' in appWindows) {
    return
  }

  appWindows.main = new BrowserWindow({
    icon: path.resolve(__dirname, 'icons/icon.png'), // tray icon
    width: 1000,
    height: 600,
    useContentSize: true,
    webPreferences: {
      contextIsolation: true,
      preload: path.resolve(__dirname, process.env.QUASAR_ELECTRON_PRELOAD)
    }
  })

  appWindows.main.loadURL(`${process.env.APP_URL}#/main/file-streams`)

  if (process.env.DEBUGGING) {
    appWindows.main.webContents.openDevTools()
  } else {
    appWindows.main.webContents.on('devtools-opened', () => {
      appWindows.main?.webContents.closeDevTools()
    })
  }

  appWindows.main.on('closed', () => {
    delete appWindows.main
  })
}

function destroyMainWindow (): void {
  if ('main' in appWindows) {
    appWindows.main.destroy()
  }
}

function createModalWindow (modalId, parentId): BrowserWindow {

  const modalUniqueId = `${parentId}_${modalId}`

  appWindows[modalUniqueId] = new BrowserWindow({
    icon: path.resolve(__dirname, 'icons/icon.png'), // tray icon
    width: 1000,
    height: 800,
    minWidth: 500,
    minHeight: 300,
    useContentSize: true,
    backgroundColor: 'black',
    webPreferences: {
      contextIsolation: true,
      preload: path.resolve(__dirname, process.env.QUASAR_ELECTRON_PRELOAD)
    },
    parent: appWindows[parentId],
    modal: true
  })

  appWindows[modalUniqueId].loadURL(`${
    process.env.APP_URL
  }?route=modal/${
    modalId.split('_').join('-')
  }&id=${modalUniqueId}`)

  if (process.env.DEBUGGING) {
    appWindows[modalUniqueId].webContents.openDevTools()
  } else {
    appWindows[modalUniqueId].webContents.on('devtools-opened', () => {
      appWindows[modalUniqueId]?.webContents.closeDevTools()
    })
  }

  appWindows[modalUniqueId].on('closed', () => {
    delete appWindows[modalUniqueId]
  })

  return appWindows[modalUniqueId]
}

function destroyModalWindow (modalId): void {
  if (modalId in appWindows) {
    appWindows[modalId].destroy()
  }
}

app.whenReady().then(createTray)

app.on('window-all-closed', () => {
  if (platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', () => {
  if (!('main' in appWindows)) {
    createMainWindow()
  }
})

ipcMain.handle('open-modal', (event, modal, parent) => {
  createModalWindow(modal, parent)
})

ipcMain.handle('close-modal', (event, modalId) => {
  destroyModalWindow(modalId)
})

ipcMain.handle('parse-file', async (event, filePath) => {
  try {
    return await fs.promises.readFile(filePath, { encoding: 'utf8' });
  } catch (e) {
    return null;
  }
})

ipcMain.handle('fetch-file-streams', async () => {
  let fileStreams = []
  const folder = path.join(app.getPath('home'), 'HydroLoader') + path.sep
  const files = await fs.promises.readdir(folder)
  for (const file of files) {
    if (file.endsWith('yaml') || file.endsWith('yml')) {
      try {
        const rawFile = await fs.promises.readFile(`${folder}${file}`, { encoding: 'utf8' })
        const parsedFile = parse(rawFile)
        fileStreams.push({
          name: file,
          conf: parsedFile
        })
      } catch (e) { }
    }
  }
  return fileStreams
})
