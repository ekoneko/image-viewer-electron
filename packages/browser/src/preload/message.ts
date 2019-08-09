import * as electron from 'electron'
const { ipcRenderer } = electron

let messageId = 0

export interface MessageOptions {
  needReply?: boolean
  replyChannel?: string
  timeout?: number
  target?: Electron.WebContents
}

interface IpcParams {
  data: any
  id: number
  needReply?: boolean
  webContentId?: number
}

interface IpcResponse<R> {
  id: number
  data: R
}

/**
 * send a message to main process
 * @param channel
 * @param data
 * @param options
 */
export function sendMessage<P>(
  channel: string,
  data: any = void 0,
  options: MessageOptions = {},
): Promise<P> {
  const id = messageId++
  const params: IpcParams = {
    data,
    id,
    needReply: options.needReply,
    webContentId: options.needReply ? electron.remote.getCurrentWebContents().id : void 0,
  }
  return new Promise((resolve, reject) => {
    if (options.needReply) {
      let timer = 0
      const listener = (_ev: Event, response: IpcResponse<P>) => {
        if (response.id !== id) return
        ipcRenderer.removeListener(options.replyChannel, listener)
        resolve(response.data)
        clearTimeout(timer)
      }
      options.replyChannel = options.replyChannel || `${channel}-reply`
      ipcRenderer.on(options.replyChannel, listener)

      timer = setTimeout(() => {
        ipcRenderer.removeListener(options.replyChannel, listener)
        reject(new Error('timeout'))
      }, options.timeout || 60000)
    } else {
      setTimeout(resolve)
    }

    if (options.target) {
      options.target.send(channel, params)
    } else {
      ipcRenderer.send(channel, params)
    }
  })
}
