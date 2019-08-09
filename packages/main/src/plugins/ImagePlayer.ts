import { AbstractPlugin } from '../AbstractPlugin'
import { screen, app } from 'electron'
import { IpcCallback } from '../helpers/IpcManager'

export class ImagePlayerPlugin extends AbstractPlugin {
  private imagePlayerWindow: Electron.BrowserWindow
  private filePaths: string[] = []

  public ready() {
    this.getBootstrap().ipcManager.add('ready', this.handleBrowserReady)
    this.getBootstrap().ipcManager.add('exit', this.handleBrowserExit)
  }

  public openFile(filePaths: string[]) {
    this.filePaths = filePaths
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
    this.imagePlayerWindow.loadURL('http://localhost:1234')
    // this.imagePlayerWindow.loadFile(indexFile)
  }

  private handleBrowserReady: IpcCallback<void, string[]> = (ev, options, reply) => {
    reply(this.filePaths)
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
