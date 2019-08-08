import * as path from 'path'
import * as fs from 'fs'
import { app } from 'electron'
import { AbstractPlugin } from '../AbstractPlugin'
import { Logger } from '../helpers/Logger'
import { ImagePlayerPlugin } from './ImagePlayer'

export class FilePlugin extends AbstractPlugin {
  private beforeReadyStack: string[] = []
  private isReady = false
  private logger: Logger

  beforeReady() {
    this.logger = this.getCore().logger
    app.on('open-file', this.handleOpenFile)
  }

  ready() {
    this.isReady = true
    if (this.beforeReadyStack.length) {
      this.logger.info('open files before ready', this.beforeReadyStack)
      this.openFile(this.beforeReadyStack)
    }
    const fileFromArgs = this.getFileFromArgs(process.argv)
    if (fileFromArgs) {
      this.logger.info('open files from args', fileFromArgs)
      this.openFile([fileFromArgs])
    }
  }

  private handleOpenFile = (event: Electron.Event, filePath: string) => {
    if (!this.isReady) {
      this.beforeReadyStack.push(filePath)
    } else {
      this.logger.info('open files', filePath)
      this.openFile([filePath])
    }
  }

  private openFile = (filePaths: string[]) => {
    this.getDepend<ImagePlayerPlugin>('imagePlayer').openFile(filePaths)
  }

  private getFileFromArgs(argv: string[]): string | void {
    for (let i = 1; i < argv.length; i++) {
      const arg = argv[i]
      if (arg.indexOf('-') !== 0 && path.isAbsolute(arg) && fs.existsSync(arg)) {
        return arg
      }
    }
  }
}
