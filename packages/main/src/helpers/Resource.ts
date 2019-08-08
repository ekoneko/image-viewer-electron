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

  public getResourcePath() {
    return this.resourcePath
  }

  private resolveResourcePath() {
    if (process.env.NODE_ENV === 'development') {
      this.resourcePath = path.join(
        require.resolve('electron/package.json'),
        '../../..',
        'resources',
      )
    } else {
      // TODO: production env
    }
  }
}
