import { LifeCycle } from './LifeCycle'
import { Bootstrap } from './Bootstrap'

export class AbstractPlugin implements LifeCycle {
  private bootstrap: Bootstrap
  getDepend: <Plugin extends AbstractPlugin = AbstractPlugin>(name: string) => Plugin
  constructor(
    core: Bootstrap,
    getDependFn: <Plugin extends AbstractPlugin = AbstractPlugin>(name: string) => Plugin,
  ) {
    this.bootstrap = core
    this.getDepend = getDependFn
  }
  public beforeReady() {}

  public ready() {}

  public activate() {}

  public focus() {}

  public beforeQuit() {}

  public secondInstance() {}

  protected getBootstrap() {
    return this.bootstrap
  }
}
