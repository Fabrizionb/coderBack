import Logger from '../../log/winston-logger.mjs'

class LoggerService {
  loggerTest () {
    Logger.debug('Debugging log')
    Logger.http('Http log')
    Logger.info('Info log')
    Logger.warn('Warning log')
    Logger.error('Error log')
    Logger.fatal('Fatal log')
  }
}

export default LoggerService
