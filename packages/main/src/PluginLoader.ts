import { LifeCycle } from './LifeCycle'
import { AbstractPlugin } from './AbstractPlugin'
import { Bootstrap } from './Bootstrap'

interface PluginMap<Plugin extends AbstractPlugin> {
  name: string
  plugin: Plugin
  depends: string[]
}

export class PluginLoader implements LifeCycle {
  private plugins: { [key: string]: PluginMap<any> } = {}
  private $bootstrap: Bootstrap

  constructor(bootstrap: Bootstrap) {
    this.$bootstrap = bootstrap
  }

  public beforeReady() {
    Object.values(this.plugins).forEach((plugin) => plugin.plugin.beforeReady())
  }

  public ready() {
    Object.values(this.plugins).forEach((plugin) => plugin.plugin.ready())
  }

  public activate() {
    Object.values(this.plugins).forEach((plugin) => plugin.plugin.activate())
  }

  public focus() {
    Object.values(this.plugins).forEach((plugin) => plugin.plugin.focus())
  }

  public beforeQuit() {
    Object.values(this.plugins).forEach((plugin) => plugin.plugin.beforeQuit())
  }

  public secondInstance() {
    Object.values(this.plugins).forEach((plugin) => plugin.plugin.secondInstance())
  }

  public load(name: string, PluginClass: typeof AbstractPlugin, depends: string[] = []) {
    const plugin = new PluginClass(this.$bootstrap, this.createGetDependFn(name))
    this.plugins[name] = {
      name,
      plugin,
      depends,
    }
  }

  private createGetDependFn = (name: string) => {
    return (depend: string) => {
      const dependScope = this.plugins[name].depends
      if (!dependScope.includes(depend)) {
        throw new Error(
          `[Plugin Error]${name} plugin request a depend "${depend}" which not defined`,
        )
      }
      return this.plugins[depend].plugin
    }
  }
}
