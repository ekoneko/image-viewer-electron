import * as path from 'path'
import * as fs from 'fs'
import { promisify } from 'util'
import { app } from 'electron'
import { uniq } from 'lodash'
import * as readChunk from 'read-chunk'
import * as fileType from 'file-type'
import { AbstractPlugin } from '../AbstractPlugin'
import { Logger } from '../helpers/Logger'
import { ImagePlayerPlugin } from './ImagePlayer'

const readdir = promisify(fs.readdir)
const getStat = promisify(fs.stat)

export class FilePlugin extends AbstractPlugin {
  private beforeReadyStack: string[] = []
  private isReady = false
  private logger: Logger

  beforeReady() {
    this.logger = this.getBootstrap().logger
    app.on('open-file', this.handleOpenFile)
  }

  async ready() {
    this.isReady = true
    if (this.beforeReadyStack.length) {
      this.logger.info('open files before ready', this.beforeReadyStack)
      this.beforeReadyStack = uniq(this.beforeReadyStack)
      this.openFile(this.beforeReadyStack)
    }
    const fileFromArgs = this.getFileFromArgs(process.argv)
    if (fileFromArgs) {
      this.logger.info('open files from args', fileFromArgs)
      const images = await this.extractImages(fileFromArgs)
      this.openFile(images)
    }
  }

  private handleOpenFile = async (event: Electron.Event, filePath: string) => {
    const images = await this.extractImages(filePath)
    if (!this.isReady) {
      Object.assign(this.beforeReadyStack, images)
    } else {
      this.logger.info('on open files', filePath)
      this.openFile(images)
    }
  }

  private openFile = async (images: string[]) => {
    this.logger.info('open images', images)
    this.getDepend<ImagePlayerPlugin>('imagePlayer').openFile(images)
  }

  private getFileFromArgs(argv: string[]): string | void {
    for (let i = 1; i < argv.length; i++) {
      const arg = argv[i]
      if (arg.indexOf('-') !== 0 && path.isAbsolute(arg) && fs.existsSync(arg)) {
        return arg
      }
    }
  }

  private async extractImages(filePath: string) {
    const stat = await getStat(filePath)
    if (stat.isDirectory()) {
      return this.extractImagesFromDirectory(filePath)
    }
    if (!stat.isFile() || !(await this.isImage(filePath, false))) {
      return [] as string[]
    }

    return [filePath]
  }

  private async extractImagesFromDirectory(dirPath: string) {
    const files = await readdir(dirPath)
    const filePaths = files.map((name) => path.join(dirPath, name))
    const images = filePaths
      .filter((file) => fs.statSync(file).isFile())
      .filter((file) => this.isImage(file))
    return images
  }

  private isImage(filePath: string, ignoreHideFile = true) {
    if (path.basename(filePath)[0] === '.' && ignoreHideFile) {
      return false
    }
    const buffer = readChunk.sync(filePath, 0, fileType.minimumBytes)
    const type = fileType(buffer)
    return type && type.mime.startsWith('image/')
  }
}
