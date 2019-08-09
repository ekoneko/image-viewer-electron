import * as path from 'path'
import { Bootstrap } from '../Bootstrap'

export class Resource {
  private readonly $bootstrap: Bootstrap
  private resourcePath: string

  constructor(bootstrap: Bootstrap) {
    this.$bootstrap = bootstrap
    this.resolveResourcePath()
    this.$bootstrap.logger.info(`Resource path is ${this.resourcePath}`)
  }

  public getResourcePath(filePath = '.') {
    return path.join(this.resourcePath, filePath)
  }

  private resolveResourcePath() {
    if (process.env.NODE_ENV === 'development') {
      const rootPath = path.join(require.resolve('electron/package.json'), '../../..')
      this.resourcePath = path.join(rootPath, 'packages/browser/dist')
    } else {
      // TODO: production env
    }
  }
}
