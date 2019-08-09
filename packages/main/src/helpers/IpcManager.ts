import { ipcMain, webContents } from 'electron'
import { Bootstrap } from '../Bootstrap'

export interface IpcOptions<P> {
  id: number
  webContentId?: number
  needReply?: boolean
  replyChannel?: string
  data: P
}

export type IpcCallback<P = void, R = void> = (
  ev: Electron.Event,
  ipcOptions: IpcOptions<P>,
  reply?: (response: R) => void,
) => void

interface IpcMap {
  [channel: string]: IpcCallback<any, any>[]
}

export class IpcManager {
  private readonly $bootstrap: Bootstrap
  private readonly ipcMap: IpcMap = {}

  constructor(bootstrap: Bootstrap) {
    this.$bootstrap = bootstrap
  }

  public add<P, R>(channel: string, cb: IpcCallback<P, R>) {
    if (!channel) return
    if (!this.ipcMap[channel]) {
      this.createIpc(channel)
    }
    this.ipcMap[channel].push(cb)
  }

  public remove(channel: string, cb: IpcCallback<any, any>) {
    if (!channel || !this.ipcMap[channel]) return
    this.ipcMap[channel] = this.ipcMap[channel].filter((item) => item !== cb)
    if (this.ipcMap[channel].length === 0) {
      this.removeIpc(channel)
    }
  }

  private createIpc<P = any>(channel: string) {
    this.ipcMap[channel] = []
    ipcMain.addListener(channel, (ev: Electron.IpcMainEvent, options: IpcOptions<P>) => {
      let reply: (response: P) => void = undefined
      if (options.needReply) {
        const replyChannel = options.replyChannel || `${channel}-reply`
        if (options.webContentId) {
          const selectedWebContents = webContents
            .getAllWebContents()
            .find((wc) => wc.id === options.webContentId)
          if (selectedWebContents) {
            reply = (response) =>
              selectedWebContents.send(replyChannel, {
                id: options.id,
                data: response,
              })
          } else {
            this.$bootstrap.logger.warn(
              `[ipcManager]${replyChannel} webContents not found(webContentId: ${
                options.webContentId
              })`,
            )
          }
        } else {
          reply = (response) =>
            ev.sender.send(replyChannel, {
              id: options.id,
              data: response,
            })
        }
      }
      this.ipcMap[channel].forEach((fn) => fn(ev, options, reply))
    })
  }

  private removeIpc(channel: string) {
    delete this.ipcMap[channel]
    ipcMain.removeAllListeners(channel)
  }
}
