import { app } from 'electron'
import * as path from 'path'
import * as log4js from 'log4js'
import { Bootstrap } from '../Bootstrap'

export class Logger {
  public logger: log4js.Logger
  private config: log4js.Configuration = {
    appenders: {
      out: {
        type: 'stdout',
        layout: {
          type: 'pattern',
          pattern: '[%d][%p]%m',
        },
      },
      persist: {
        type: 'file',
        layout: {
          type: 'pattern',
          pattern: '[%d][%p]%m',
        },
        filename: path.join(app.getPath('userData'), 'Logs', 'app.log'),
        maxLogSize: 1024 * 1024 * 10,
        backups: 3,
      },
    },
    categories: {
      default: {
        appenders: ['out', 'persist'],
        level: process.env.NODE_ENV === 'development' ? 'all' : 'info',
      },
    },
  }
  private readonly $bootstrap: Bootstrap

  constructor(bootstrap: Bootstrap) {
    log4js.configure(this.config)
    this.logger = log4js.getLogger()
    this.$bootstrap = bootstrap
  }

  public trace(message: any, ...args: any[]) {
    this.logger.trace(message, ...args)
  }
  public debug(message: any, ...args: any[]) {
    this.logger.debug(message, ...args)
  }
  public info(message: any, ...args: any[]) {
    this.logger.info(message, ...args)
  }
  public warn(message: any, ...args: any[]) {
    this.logger.warn(message, ...args)
  }
  public error(message: any, ...args: any[]) {
    this.logger.error(message, ...args)
  }
  public fatal(message: any, ...args: any[]) {
    this.logger.fatal(message, ...args)
  }
}
