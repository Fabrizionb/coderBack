import utils from '../utils/view.util.js'
import { createHash } from '../utils/crypto.js'
// import UserService from '../Dao/mongo/user.service.mjs'
import UserDto from '../Dao/dto/user.dto.js'
import DaoFactory from '../Dao/DaoFactory.mjs'
import CustomError from '../errors/custom.error.mjs'
class UserController {
  #CartService
  #ProductService
  #UserService
  #TicketService
  constructor () {
    this.initializeServices()
  }

  async initializeServices () {
    this.#CartService = await DaoFactory.getDao('cart')
    this.#UserService = await DaoFactory.getDao('user')
    this.#ProductService = await DaoFactory.getDao('product')
    this.#TicketService = await DaoFactory.getDao('ticket')
  }

  async google (req, res) { }

  async googleCallback (req, res) {
    utils.setAuthCookie(req.user, res)
    res.redirect('/')
  }

  async github (req, res, next) { }

  async githubCallback (req, res) {
    utils.setAuthCookie(req.user, res)
    res.redirect('/')
  }

  async failureLogin (req, res) {
    console.log('failurelogin')
    res.send({ error: 'User or password incorrect' })
  }

  async failureRegister (req, res, next) {
    console.log('failureregister')
    res.send({ error: 'Error on register' })
  }

  async unauthorized (req, res, next) {
    res.render('unauthorized', {
      title: 'Unauthorized',
      msg: 'You are Unauthorized, please log in.'
    })
  }

  async logout (req, res, next) {
    try {
      req.session.destroy()
      res.clearCookie('connect.sid')
      res.clearCookie('AUTH') // clear cookie "AUTH"
      res.okResponse({ response: 'success' })
    } catch (error) {
      if (error instanceof CustomError) {
        next(error)
      } else {
        next(CustomError.createError({
          name: 'Server Error',
          cause: error,
          message: 'Error on logout',
          code: 500
        }))
      }
    }
  }

  async current (req, res, next) {
    const user = req.user
    if (!user) {
      throw CustomError.createError({
        name: 'Not Found',
        cause: new Error('User not found'),
        message: 'User not found',
        code: 104
      })
    }
    const userDto = new UserDto(user)
    res.json({ user: userDto })
  }

  async register (req, res, next) {
    try {
      const { email, password, name, lastname } = req.body

      const userExists = await this.#UserService.findOne({ email })
      if (!userExists) {
        throw CustomError.createError({
          name: 'Not Found',
          cause: new Error('User not found'),
          message: 'User not found',
          code: 104
        })
      }

      const hashedPassword = createHash(password)
      const newUser = await this.#UserService.create({
        email,
        password: hashedPassword,
        name,
        lastname
      })
      if (!newUser) {
        throw CustomError.createError({
          name: 'Error Creating User',
          cause: new Error(`Failed to create user ${email}`),
          message: `Failed to create user ${email}`,
          code: 208
        })
      }
      res.okResponse({ message: 'User Registered', user: newUser })
    } catch (error) {
      if (error instanceof CustomError) {
        next(error)
      } else {
        next(CustomError.createError({
          name: 'Server Error',
          cause: error,
          message: 'Error on register',
          code: 500
        }))
      }
    }
  }

  async login (req, res, next) {
    res.okResponse({ message: 'User Logged' })
  }

  async restorePassword (req, res, next) {
    try {
      if (!req.body) {
        throw CustomError.createError({
          name: 'Bad Request',
          cause: new Error('Request body missing'),
          message: 'Request body missing',
          code: 400
        })
      }
      const { email, newPassword } = req.body
      const user = await this.#UserService.findOne({ email })
      if (!user) {
        throw CustomError.createError({
          name: 'Not Found',
          cause: new Error('User not found'),
          message: 'User not found',
          code: 104
        })
      }
      const hashedPassword = createHash(newPassword)
      const updated = await this.#UserService.updateOne(
        { email },
        { $set: { password: hashedPassword } }
      )
      if (!updated) {
        throw CustomError.createError({
          name: 'Error Updating User',
          cause: new Error(`Failed to update user ${email}`),
          message: `Failed to update user ${email}`,
          code: 209
        })
      }
      res.okResponse({ status: '200', message: 'Password changed' })
    } catch (error) {
      if (error instanceof CustomError) {
        next(error)
      } else {
        next(CustomError.createError({
          name: 'Server Error',
          cause: error,
          message: 'Error on restore password',
          code: 500
        }))
      }
    }
  }
}

const controller = new UserController()

export default controller
