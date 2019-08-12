import { AbstractPlugin } from '../AbstractPlugin'
import { screen, app } from 'electron'
import { IpcCallback } from '../helpers/IpcManager'

export interface ImagePlayerData {
  imageList: string[]
  index: number
}

export class ImagePlayerPlugin extends AbstractPlugin {
  private imagePlayerWindow: Electron.BrowserWindow
  private imagePlayerData: ImagePlayerData

  public ready() {
    this.getBootstrap().ipcManager.add('ready', this.handleBrowserReady)
    this.getBootstrap().ipcManager.add('exit', this.handleBrowserExit)
  }

  public openFile(filePaths: string[], index = 0) {
    this.imagePlayerData = {
      imageList: filePaths,
      index: index,
    }
    this.createImagePlayerWindow()
  }

  private createImagePlayerWindow() {
    if (this.imagePlayerWindow && !this.imagePlayerWindow.isDestroyed()) {
      if (!this.imagePlayerWindow.isVisible()) {
        this.imagePlayerWindow.show()
      }
      return
    }
    const { resource } = this.getBootstrap()
    const indexFile = resource.getResourcePath('index.html')
    const { width, height } = screen.getPrimaryDisplay().workAreaSize
    this.imagePlayerWindow = this.getBootstrap().view.createWindow({
      show: true,
      transparent: true,
      backgroundColor: '#BC000000',
      thickFrame: false,
      frame: false,
      width,
      height,
      webPreferences: {
        devTools: process.env.NODE_ENV === 'development',
      },
    })
    this.imagePlayerWindow.loadFile(indexFile)
  }

  private handleBrowserReady: IpcCallback<void, ImagePlayerData> = (ev, options, reply) => {
    reply(this.imagePlayerData)
  }

  private handleBrowserExit: IpcCallback<void, string[]> = (ev, options, reply) => {
    this.getBootstrap().logger.info('imagePlayer send an exit ipc message')
    if (this.imagePlayerWindow) {
      this.imagePlayerWindow.destroy()
      this.imagePlayerWindow = null
      if (this.getBootstrap().view.getWindowsCount() === 0) {
        app.quit()
      }
    }
  }
}
