import Logger from './winston-logger.mjs'

export const loggerMiddleware = (req, res, next) => {
  req.logger = Logger
  req.logger.http(`${req.method} in ${req.url}`)
  next()
}
