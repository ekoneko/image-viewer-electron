import { app } from 'electron'
import * as fs from 'fs-extra'
import * as path from 'path'
import { promisify } from 'util'
import { Bootstrap } from '../Bootstrap'

const readFilePromisify = promisify(fs.readFile)
const writeFilePromisify = promisify(fs.writeFile) as (
  file: string | Buffer | number,
  data: any,
) => Promise<void>

const UserDataDirectory = 'data'

export class UserData {
  private dataPath: string
  private readonly $bootstrap: Bootstrap

  constructor(bootstrap: Bootstrap) {
    this.dataPath = app.getPath('userData')
    this.$bootstrap = bootstrap
    this.$bootstrap.logger.info(`User data path is ${this.dataPath}`)
  }

  public async readUserData(key: string) {
    const fullPath = this.getUserDataPath(key)
    return readFilePromisify(fullPath)
  }

  public async writeUserData(key: string, data: string | Buffer) {
    const fullPath = this.getUserDataPath(key)
    return writeFilePromisify(fullPath, data)
  }

  public readUserDataSync(key: string) {
    const fullPath = this.getUserDataPath(key)
    return fs.readFileSync(fullPath)
  }

  public writeUserDataSync(key: string, data: string | Buffer) {
    const fullPath = this.getUserDataPath(key)
    return fs.writeFileSync(fullPath, data)
  }

  private getUserDataPath = (key: string) => {
    const userDataPath = path.join(this.dataPath, UserDataDirectory, key)
    const userDataFolder = path.parse(userDataPath).dir
    if (!fs.existsSync(userDataFolder)) {
      fs.mkdirpSync(userDataFolder)
    }
    return userDataPath
  }
}
