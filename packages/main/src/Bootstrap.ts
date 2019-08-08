import * as fs from 'fs'
import * as path from 'path'
import { app, dialog } from 'electron'
import { LifeCycle } from './LifeCycle'
import { Logger } from './helpers/Logger'
import { UserData } from './helpers/UserData'
import { Resource } from './helpers/Resource'
import { View } from './helpers/View'
import { IpcManager } from './helpers/IpcManager'

export class Bootstrap implements LifeCycle {
  public logger: Logger
  public userData: UserData
  public resource: Resource
  public view: View
  public request: Request
  public ipcManager: IpcManager

  constructor() {
    this.checkEnv()
    this.logger = new Logger(this)
    this.userData = new UserData(this)
    this.resource = new Resource(this)
    this.view = new View(this)
    this.ipcManager = new IpcManager(this)
  }

  public ready() {
    //
  }

  public activate() {
    //
  }

  public focus() {
    //
  }

  public beforeQuit() {
    //
  }

  public secondInstance() {
    //
  }

  private checkEnv() {
    try {
      fs.readFileSync(path.join(app.getPath('userData'), 'tmp'), { flag: 'a' })
    } catch (e) {
      if (e.message.includes('permission denied')) {
        app.on('ready', () => this.openNoPremissDialog())
      }
    }
  }

  private async openNoPremissDialog() {
    await dialog.showMessageBox(null, {
      type: 'error',
      buttons: ['确定'],
      title: '启动失败',
      message: '创建数据目录失败, 请以更高的权限运行',
    })
    app.quit()
  }
}
