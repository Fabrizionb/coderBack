import LoggerService from '../Dao/service/logger.service.mjs'

class LoggerController {
  #loggerService
  constructor () {
    this.#loggerService = new LoggerService()
  }

  loggerTest (req, res) {
    this.#loggerService.loggerTest()
    res.send('Logs created successfully.')
  }
}

const controller = new LoggerController()
export default controller
