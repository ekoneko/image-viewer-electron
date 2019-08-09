import { sendMessage } from '../preload/message'

export interface ElectronHelper {
  sendMessage: typeof sendMessage
}
