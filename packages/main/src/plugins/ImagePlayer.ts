import { AbstractPlugin } from '../AbstractPlugin'
import { screen } from 'electron'
import { IpcCallback } from '../helpers/IpcManager'

export class ImagePlayerPlugin extends AbstractPlugin {
  private imagePlayerWindow: Electron.BrowserWindow
  private filePaths: string[] = []
  public openFile(filePaths: string[]) {
    this.filePaths = filePaths
    this.createImagePlayerWindow()
    this.getBootstrap().ipcManager.add('ready', this.handleBrowserReady)
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
      backgroundColor: '#000000B3',
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

  private handleBrowserReady: IpcCallback<void, string[]> = (ev, options, reply) => {
    reply(this.filePaths)
  }
}
