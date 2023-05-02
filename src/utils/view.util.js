import jwtLib from 'jsonwebtoken'
import config from '../../data.js'

function isValidPage (page, totalPages) {
  if (page === undefined) {
    return true
  }
  if (isNaN(page) || page <= 0 || page > totalPages) {
    return false
  }
  return true
}

// Utilidad para extraer valores del objeto req.session.passport
const getSessionValue = (req, property) => {
  const user = req.session.passport?.user
  return user?.[property] ?? null
}

// Crear el objeto sort a partir del query
const createSortObject = (query) => {
  const sort = {}
  sort[query.sort] = query.order === 'desc' ? -1 : 1

  if (query.sort === 'price' && query[query.sort]) {
    sort[query.sort] = sort[query.sort] * parseInt(query[query.sort])
  }

  return sort
}

// Crear el objeto conditions a partir del query
const createConditionsObject = (query) => {
  const conditions = {}

  if (query.category) {
    conditions.category = query.category
  }

  if (query.status) {
    conditions.status = query.status === 'true'
  }

  return conditions
}

function setAuthCookie (user, res) {
  const userObj = {
    userId: user._id.toString(),
    cartId: user.cartId.toString(),
    role: user.role
  }
  const token = jwtLib.sign(userObj, config.JWT_SECRET, { expiresIn: '24h' })
  res.cookie('AUTH', token, {
    maxAge: 60 * 60 * 1000 * 24,
    httpOnly: true
  })
}
function cookieExtractor (req) {
  return req?.cookies?.AUTH || null
}

export default {
  isValidPage,
  getSessionValue,
  createSortObject,
  createConditionsObject,
  setAuthCookie,
  cookieExtractor
}
