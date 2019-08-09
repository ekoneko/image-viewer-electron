import { protocol } from 'electron'
import { Bootstrap } from '../Bootstrap'

export class FileProtocol {
  private readonly $bootstrap: Bootstrap

  constructor(bootstrap: Bootstrap) {
    this.$bootstrap = bootstrap

    protocol.registerStandardSchemes(['file'])
  }
}
