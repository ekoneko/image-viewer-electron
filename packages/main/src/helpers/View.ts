import * as path from 'path'
import { BrowserWindow } from 'electron'
import { Bootstrap } from '../Bootstrap'

export class View {
  private $bootstrap: Bootstrap
  private windows: Electron.BrowserWindow[] = []

  constructor(bootstrap: Bootstrap) {
    this.$bootstrap = bootstrap
  }

  public createWindow(options: Electron.BrowserWindowConstructorOptions) {
    // const resource = this.$bootstrap.resource
    // const preloadJs = path.join(resource.getResourcePath(), 'preload.js')
    const composeOptions = {
      autoHideMenuBar: true,
      backgroundColor: '#fff',
      show: true,
      resizable: false,
      ...options,
      webPreferences: {
        nodeIntegration: false,
        webSecurity: true,
        minimumFontSize: 12,
        defaultEncoding: 'utf-8',
        // preload: preloadJs,
        ...options.webPreferences,
      },
    }
    const win = new BrowserWindow(composeOptions)
    this.windows.push(win)
    return win
  }

  public destroyWindow(win: Electron.BrowserWindow) {
    this.windows.filter((w) => w !== win)
    win.destroy()
  }

  public getWindowsCount() {
    return this.windows.length
  }
}
