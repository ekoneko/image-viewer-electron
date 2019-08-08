import { AbstractPlugin } from '../AbstractPlugin'
import { screen } from 'electron'

export class ImagePlayerPlugin extends AbstractPlugin {
  private imagePlayerWindow: Electron.BrowserWindow
  public openFile(filePaths: string[]) {
    // this.getCore().ipcManager
    this.createImagePlayerWindow()
  }

  private createImagePlayerWindow() {
    if (this.imagePlayerWindow && !this.imagePlayerWindow.isDestroyed()) {
      if (!this.imagePlayerWindow.isVisible()) {
        this.imagePlayerWindow.show()
      }
      return
    }
    const { width, height } = screen.getPrimaryDisplay().workAreaSize
    this.imagePlayerWindow = this.getCore().view.createWindow({
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
    // this.imagePlayerWindow.loadURL('http://localhost:1234')
  }
}
