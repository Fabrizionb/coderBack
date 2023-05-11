import utils from '../utils/view.util.js'
import { createHash } from '../utils/crypto.js'
import UserService from '../services/user.service.mjs'
class UserController {
  #service
  constructor (service) {
    this.#service = service
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
    const { _id, email, name, lastname, cartId, role } = req.user
    res.json({ user: { _id, email, name, lastname, cartId, role } })
  }

  async register (req, res, next) {
    try {
      const { email, password, name, lastname } = req.body

      const userExists = await this.#service.findOne({ email })
      if (userExists) {
        return res.status(201).send({ error: 'User Created' })
      }

      const hashedPassword = createHash(password)
      const newUser = await this.#service.create({
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
      const user = await this.#service.findOne({ email })
      if (!user) {
        res.status(203).json({ status: '404', message: 'User not found' })
        return
      }
      const hashedPassword = createHash(newPassword)
      await this.#service.updateOne(
        { email },
        { $set: { password: hashedPassword } }
      )
      res.status(200).send({ status: '200', message: 'Password changed' })
    } catch (error) {
      next(error)
    }
  }
}

const controller = new UserController(new UserService())

export default controller
