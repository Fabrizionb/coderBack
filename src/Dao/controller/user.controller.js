import userModel from '../models/user.model.js'
import utils from '../../utils/view.util.js'
import { createHash, isValidPassword } from '../../utils/crypto.js'

class UserController {
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
    res.status(201).send({ message: 'User Logged' })
  }

  async login (req, res, next) {
    res.status(200).send({ message: 'User Logged' })
  }

  async restorePassword (req, res, next) {
    try {
      const { email, newPassword } = req.body
      const user = await userModel.findOne({ email })
      if (!user) {
        res.status(203).json({ status: '404', message: 'User not found' })
        return
      }
      const hashedPassword = createHash(newPassword)
      await userModel.updateOne(
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
