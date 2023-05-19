import utils from '../utils/view.util.js'
import { createHash } from '../utils/crypto.js'
// import UserService from '../Dao/services/user.service.mjs'
import UserDto from '../Dao/dto/user.dto.js'
import DaoFactory from '../Dao/DaoFactory.mjs'
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

  async google (req, res) {}

  async googleCallback (req, res) {
    utils.setAuthCookie(req.user, res)
    res.redirect('/')
  }

  async github (req, res, next) {}

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
      res.status(200).json({ response: 'success' })
    } catch (error) {
      next(error)
    }
  }

  async current (req, res, next) {
    const user = req.user
    const userDto = new UserDto(user)
    res.json({ user: userDto })
  }

  async register (req, res, next) {
    try {
      const { email, password, name, lastname } = req.body

      const userExists = await this.#UserService.findOne({ email })
      if (userExists) {
        return res.status(201).send({ error: 'User Created' })
      }

      const hashedPassword = createHash(password)
      const newUser = await this.#UserService.create({
        email,
        password: hashedPassword,
        name,
        lastname
      })

      res.status(201).send({ message: 'User Registered', user: newUser })
    } catch (error) {
      next(error)
    }
  }

  async login (req, res, next) {
    res.status(200).send({ message: 'User Logged' })
  }

  async restorePassword (req, res, next) {
    try {
      const { email, newPassword } = req.body
      const user = await this.#UserService.findOne({ email })
      if (!user) {
        res.status(203).json({ status: '404', message: 'User not found' })
        return
      }
      const hashedPassword = createHash(newPassword)
      await this.#UserService.updateOne(
        { email },
        { $set: { password: hashedPassword } }
      )
      res.status(200).send({ status: '200', message: 'Password changed' })
    } catch (error) {
      next(error)
    }
  }
}

const controller = new UserController()

export default controller
