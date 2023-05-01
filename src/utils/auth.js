import passport from 'passport'
import jwt from 'jsonwebtoken'
import config from '../../data.js'

export const passportCall = (strategy) => {
  return async (req, res, next) => {
    passport.authenticate(strategy, (error, user, info) => {
      if (error) return next(error)
      if (!user) {
        return res.status(401).send({ error: info.message ?? info.toString() })
      }
      req.user = user
      next()
    })(req, res, next)
  }
}

export const authorization = (rol) => {
  return async (req, res, next) => {
    const cookie = req?.cookies?.AUTH || null
    if (!cookie) {
      return res.status(401).send({ error: 'User is not logged in' })
    }

    try {
      const token = jwt.verify(cookie, config.JWT_SECRET)
      const userId = token.userId
      const cartId = token.cartId
      const role = token.role
      req.user = { userId, cartId, role }

      // Verificar si el usuario ya está autenticado
      if (!rol && req.user) {
        return res.status(200).send({ message: 'User already authenticated' })
      }

      if (req.user.role !== rol) {
        return res
          .status(403)
          .send({ error: `User does not have the role ${rol}` })
      }
      next()
    } catch (error) {
      console.error(error)
      return res.status(401).send({ error: 'Invalid token' })
    }
  }
}
