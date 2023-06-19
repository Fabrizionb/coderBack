/* eslint-disable */
import utils from '../utils/view.util.js'
import { createHash, isValidPassword } from '../utils/crypto.js'
// import UserService from '../Dao/mongo/user.service.mjs'
import UserDto from '../Dao/dto/user.dto.js'
import DaoFactory from '../Dao/DaoFactory.mjs'
import CustomError from '../errors/custom.error.mjs'
import nodemailer from 'nodemailer'
import config from '../../data.js'
import Logger from '../log/winston-logger.mjs'
import jwt from 'jsonwebtoken'

class UserController {
  #CartService
  #ProductService
  #UserService
  #TicketService
  constructor() {
    this.initializeServices()
  }

  async initializeServices() {
    this.#CartService = await DaoFactory.getDao('cart')
    this.#UserService = await DaoFactory.getDao('user')
    this.#ProductService = await DaoFactory.getDao('product')
    this.#TicketService = await DaoFactory.getDao('ticket')
  }

  async google(req, res) { }

  async googleCallback(req, res) {
    utils.setAuthCookie(req.user, res)
    res.redirect('/')
  }

  async github(req, res, next) { }

  async githubCallback(req, res) {
    utils.setAuthCookie(req.user, res)
    res.redirect('/')
  }

  async failureLogin(req, res) {
    req.logger.error('failureLogin: User or password incorrect')
    res.send({ error: 'User or password incorrect' })
  }

  async failureRegister(req, res, next) {
    req.logger.error('failureRegister: Error on register')
    res.send({ error: 'Error on register' })
  }

  async unauthorized(req, res, next) {
    res.render('unauthorized', {
      title: 'Unauthorized',
      msg: 'You are Unauthorized, please log in.'
    })
  }

  async logout(req, res, next) {
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

  async current(req, res, next) {
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

  async register(req, res, next) {
    try {
      const { email, password, name, lastname } = req.body
      const userExists = await this.#UserService.findOne({ email })
      if (userExists) {
        throw CustomError.createError({
          name: 'User Found',
          cause: new Error('User found'),
          message: 'User found',
          code: 104
        })
      }

      // new cart
      const createdCart = await fetch("http://localhost:8080/api/cart", {
        method: "POST",
      });
      const cartData = await createdCart.json();
      const cartId = cartData.payload.carts[0]._id;

      const hashedPassword = createHash(password)
      const newUser = await this.#UserService.create({
        email,
        password: hashedPassword,
        name,
        lastname,
        cartId
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

  async login(req, res, next) {
    try {
      const { email, password } = req.body
      const user = await this.#UserService.findOne({ email })

      if (!user) {
        req.logger.info('User not found')
        return res.userErrorResponse({ message: 'User not found', code: 'USER_NOT_FOUND' })
      }

      const validPassword = await isValidPassword(password, user.password)

      if (!validPassword) {
        req.logger.info('Password incorrect')
        return res.userErrorResponse({ message: 'Password incorrect', code: 'INVALID_PASSWORD' })
      }

      const userObj = {
          userId: user._id.toString(),
          cartId: user.cartId.toString(),
          role: user.role
      }

      const token = jwt.sign(userObj, config.JWT_SECRET, {
          expiresIn: '24h'
      })

      res.cookie('AUTH', token, {
          maxAge: 60 * 60 * 1000 * 24,
          httpOnly: true
      })

      res.okResponse({ message: 'User Logged' })
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

  async restorePassword(email,res) {
    const transporter = nodemailer.createTransport({
      host: 'smtp.gmail.com',
      port: 587,
      auth: {
        user: config.GOOGLE_MAILER_USER,
        pass: config.GOOGLE_MAILER
      }
    })
    const emailAdress = email.body.email
    const secret = config.JWT_SECRET
    const token = jwt.sign({ email: emailAdress }, secret, { expiresIn: '24h' })
    try {
    transporter.sendMail({
      from: "'CoderBack' <proyecto@coderhouse.com>",
      to: emailAdress,
      subject: 'Recover Password',
      html: `
      <div style="font-family: Arial, sans-serif; color: #333; max-width: 600px; margin: auto;">
          <h1 style="text-align: center; color: #4F4F4F;">Password Reset</h1>
          <p style="font-size: 16px; line-height: 1.5; color: #333;">
              We received a request to reset your password. Click the button below to set a new password. If you did not request this, please ignore this email.
          </p>
          <div style="text-align: center; margin: 30px 0;">
              <a href="${config.BASE_URL}/reset-password/${token}" style="background-color: #4CAF50; color: white; padding: 15px 32px; text-align: center; text-decoration: none; display: inline-block; font-size: 16px; margin: 4px 2px; cursor: pointer; border: none;">Reset Password</a>
          </div>
          <p style="font-size: 14px; color: #888; text-align: center;">If the button doesn't work, copy and paste the following link in your web browser:</p>
          <p style="text-align: center;"><a href="${config.BASE_URL}/reset-password/${token}" style="color: #4CAF50;">${config.BASE_URL}/reset-password/${token}</a></p>
          <hr style="border: 0; border-top: 1px solid #f6f6f6;">
          <p style="font-size: 14px; color: #888; text-align: center;">This is an automated email, please do not reply.</p>
      </div>
  `})
  res.okResponse({ message: 'Reset link sent successfully' });
} catch (error) {
  Logger.error(error)
  res.serverErrorResponse({ message: error.message, code: 500 });
  }
}

  async resetPassword(req, res, next) {
    try {
      const { token, newPassword } = req.body
      Logger.debug("token, newPassword ", token, newPassword)
      let decodedToken
      try {
        decodedToken = jwt.verify(token, config.JWT_SECRET)
        Logger.debug("decodedToken: ", decodedToken)
      } catch (err) {
        throw CustomError.createError({
          name: 'Bad Request',
          cause: new Error('Invalid or expired token'),
          message: 'Invalid or expired token',
          code: 400
        })
      }
      Logger.debug("decodedToken.email: ", decodedToken.email)
      const user = await this.#UserService.findOne({ email: decodedToken.email })
      Logger.debug("User: ", user)
      if (!user) {
        throw CustomError.createError({
          name: 'Not Found',
          cause: new Error('User not found'),
          message: 'User not found',
          code: 404
        })
      }
      Logger.debug("isValidPassword(newPassword, user.password): ", isValidPassword(newPassword, user.password))
      if (isValidPassword(newPassword, user.password)) {
        throw CustomError.createError({
          name: 'Bad Request',
          cause: new Error('New password cannot be the same as the current password'),
          message: 'New password cannot be the same as the current password',
          code: 400
        })
      }
      const hashedPassword = createHash(newPassword)
      Logger.debug("new hashedPassword: ", hashedPassword)
      await this.#UserService.update(user._id, { password: hashedPassword })

      res.okResponse({ message: 'Password updated successfully' })
    } catch (error) {
      if (error instanceof CustomError) {
        res.userErrorResponse(error)
      } else {
        res.serverErrorResponse(error)
      }
    }
  }
}

const controller = new UserController()

export default controller
