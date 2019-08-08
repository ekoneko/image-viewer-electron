import { ipcMain } from 'electron'
import { Bootstrap } from '../Bootstrap'

export interface IpcOptions<P> {
  id: number
  // TODO: support message to selected web contents
  webContentId?: number
  needReply?: boolean
  data: P
}

export type IpcCallback<P> = (
  ev: Electron.Event,
  ipcOptions: IpcOptions<P>,
  reply?: (response: any) => void,
) => void

interface IpcMap {
  [channel: string]: IpcCallback<any>[]
}

export class IpcManager {
  private readonly $bootstrap: Bootstrap
  private readonly ipcMap: IpcMap = {}

  constructor(bootstrap: Bootstrap) {
    this.$bootstrap = bootstrap
  }

  public add<P = {}>(channel: string, cb: IpcCallback<P>) {
    if (!channel) return
    if (!this.ipcMap[channel]) {
      this.createIpc(channel)
    }
    this.ipcMap[channel].push(cb)
  }

  public remove(channel: string, cb: IpcCallback<any>) {
    if (!channel || !this.ipcMap[channel]) return
    this.ipcMap[channel] = this.ipcMap[channel].filter((item) => item !== cb)
    if (this.ipcMap[channel].length === 0) {
      this.removeIpc(channel)
    }
  }

  private createIpc<P>(channel: string) {
    this.ipcMap[channel] = []
    ipcMain.addListener(channel, (ev: Electron.IpcMainEvent, options: IpcOptions<P>) => {
      this.ipcMap[channel].forEach((fn) =>
        fn(
          ev,
          options,
          options.needReply
            ? (response) => {
                ev.sender.send(`${channel}-reply`, {
                  id: options.id,
                  data: response,
                })
              }
            : undefined,
        ),
      )
    })
  }

  private removeIpc(channel: string) {
    delete this.ipcMap[channel]
    ipcMain.removeAllListeners(channel)
  }
}
