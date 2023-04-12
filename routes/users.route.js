import { Router } from 'express'
import userManager from '../Dao/controller/userManager.js'
const route = Router()

route.post('/login', async (req, res, next) => {
  try {
    const { email, password } = req.body
    if (email === 'adminCoder@coder.com' && password === 'adminCod3r123') {
      const superAdmin = {
        name: 'Admin',
        lastname: 'Admin',
        email: 'adminCoder@coder.com',
        password: 'adminCod3r123',
        role: 'admin'
      }
      req.session.userId = superAdmin._id.toString()
      req.session.user = superAdmin
      return res.status(200).json(superAdmin)
    }

    const user = await userManager.login(email, password)

    const userId = user._id.toString()
    const cartId = user.cartId._id.toString()

    req.session.userId = userId
    req.session.cartId = cartId
    req.session.user = user

    res.status(200).json(user)
  } catch (error) {
    next(error)
  }
})

route.post('/register', async (req, res, next) => {
  try {
    const { email, password, name, lastname } = req.body
    const data = await userManager.register(email, password, name, lastname)
    const { user } = data
    const userId = user._id.toString()
    const cartId = user.cartId.toString()
    req.session.userId = userId
    req.session.cartId = cartId
    if (data) {
      return res.status(203).json({ status: '203', message: data.message })
    }
    res.status(200).json({ user })
  } catch (error) {
    next(error)
  }
})

route.post('/logout', (req, res, next) => {
  try {
    req.session.destroy()
    res.clearCookie('connect.sid')
    res.status(200).json({ response: 'success' })
  } catch (error) {
    next(error)
  }
})

export default route
