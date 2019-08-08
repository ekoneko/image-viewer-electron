import { app } from 'electron'
import { config } from './config'
import { Bootstrap } from './Bootstrap'
import { PluginLoader } from './PluginLoader'
import { FilePlugin } from './plugins/File'
import { ImagePlayerPlugin } from './plugins/ImagePlayer'

config()

const bootstrap = new Bootstrap()
const pluginLoader = new PluginLoader(bootstrap)
pluginLoader.load('imagePlayer', ImagePlayerPlugin, [])
pluginLoader.load('file', FilePlugin, ['imagePlayer'])

pluginLoader.beforeReady()

app.on('ready', (launchInfo) => {
  pluginLoader.ready()
})

app.on('activate', (ev, hasVisibleWindows) => {
  pluginLoader.activate()
})

app.on('before-quit', () => {
  pluginLoader.beforeQuit()
})
