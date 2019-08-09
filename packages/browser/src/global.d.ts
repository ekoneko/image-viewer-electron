import { ElectronHelper } from './types/electronHelper'

declare global {
  interface Window {
    electronHelper: ElectronHelper
  }
}
