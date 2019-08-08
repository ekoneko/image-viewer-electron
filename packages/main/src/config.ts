import * as fs from 'fs'
import * as path from 'path'
import * as dotenv from 'dotenv'

function getConfPath() {
  const rootPath = path.join(require.resolve('dotenv/package.json'), '../../..')
  const localConfig = path.join(rootPath, '.env.local')
  const defaultConfig = path.join(rootPath, '.env')
  if (process.env.NODE_ENV === 'development' && fs.existsSync(localConfig)) {
    return localConfig
  }
  return defaultConfig
}

export async function config() {
  const confPath = getConfPath()
  dotenv.config({
    path: confPath,
  })
}
