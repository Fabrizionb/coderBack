import passport from 'passport'
import jwt from 'jsonwebtoken'
import config from '../../data.js'

export const passportCall = (strategy) => {
  return async (req, res, next) => {
    passport.authenticate(strategy, (error, user, info) => {
      if (error) return next(error)
      if (!user) {
        // return res.status(401).send({ error: info.message ?? info.toString() })
        return res.status(401).redirect('/api/user/unauthorized')
      }
      req.user = user
      next()
    })(req, res, next)
  }
}

export const authorization = (roles) => {
  return async (req, res, next) => {
    const cookie = req?.cookies?.AUTH || null
    if (!cookie) {
      return res.status(401).redirect('/api/user/unauthorized')
    }

    try {
      const token = jwt.verify(cookie, config.JWT_SECRET)
      const userId = token.userId
      const cartId = token.cartId
      const role = token.role
      req.user = { userId, cartId, role }

      // Verificar si el usuario ya está autenticado
      if (!roles && req.user) {
        return res.status(200).send({ message: 'User already authenticated' })
      }

      if (!roles.includes(req.user.role)) {
        return res.status(403).redirect('/api/user/unauthorized')
      }
      next()
    } catch (error) {
      console.error(error)
      return res.status(401).send({ error: 'Invalid token' })
    }
  }
}
