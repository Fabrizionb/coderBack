import { Router } from 'express'

const route = Router()

route.get('/setCookie', (req, res) => {
  res.cookie('CoderCookie', 'Esta es una cookie poderosa', { maxAge: 100000, signed: true }).send('Cookie')
})

route.get('/getCookie', (req, res) => {
  const cookies = req.cookies
  const signedCookies = req.signedCookies
  const authCookie = req.cookies.AUTH || 'No AUTH cookie found'

  console.log('All cookies:', cookies)
  console.log('AUTH cookie:', authCookie)
  res.send({ cookies, signedCookies, authCookie })
})

route.get('/deleteCookie', (req, res) => {
  res.clearCookie('CoderCookie').send('Se borro la cookie')
})

export default route
