import express from 'express'
import productsRoute from './routes/products.route.js'
import cartRoute from './routes/cart.route.js'
import fileDirname from './utils/fileDirName.js'
import cookieParser from 'cookie-parser'
import { create } from 'express-handlebars'
import helpers from './lib/helpers.handlebars.js'
import viewsRoute from './routes/views.route.js'
import configureSocket from './socket/configure-socket.js'
import mongoose from 'mongoose'
import config from './data.js'
import session from 'express-session'
const { PORT, MONGO_URI, COOKIE_SECRET } = config
const { __dirname } = fileDirname(import.meta)
const app = express()
const httpServer = app.listen(PORT, () => console.log(`escuchando puerto ${PORT}`))
/* eslint-disable  */
// config socket.io
configureSocket(httpServer)

app.use(session({
  secret: COOKIE_SECRET,
  resave: true,
  saveUninitialized: true
}))
app.use(cookieParser(COOKIE_SECRET))
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

// Config Handlebars
const hbs = create({
  partialsDir: ['views/partials'],
  helpers
})

app.engine('handlebars', hbs.engine)
app.set('views', __dirname + '/views')
app.set('view engine', 'handlebars')

app.use('/api/products', productsRoute)
app.use('/api/cart', cartRoute)
app.use(express.static(__dirname + '/public'))
app.use('/', viewsRoute)

// Mongoose
mongoose.connect(MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})

// Cookies
const auth = (req, res, next) =>{
  const admin = req.session.admin
  if (admin){
    next()
    return
  } else {
    res.status(401).send({error: 'No Autorizado'})
  }
}
app.get('/setCookie', (req, res) => {
  res.cookie('CoderCookie', 'Esta es una cookie poderosa', { maxAge: 100000, signed: true }).send('Cookie')
})

app.get('/getCookie', (req, res) => {
  const cookies = req.cookies
  const signedCookies = req.signedCookies
  console.log(cookies)
  res.send({ cookies, signedCookies })
})

app.get('/deleteCookie', (req, res) => {
  res.clearCookie('CoderCookie').send('Se borro la cookie')
})

// Session
app.get('/session', (req, res)=>{
  if (req.session){
    if (req.session.counter){
      req.session.counter++
      res.send({counter: req.session.counter})
    } else {
      req.session.counter = 1
      res.send({counter: req.session.counter, firstTime : true})
    }
  } else {
    res.send('Error: Session not initialized')
  }
})
// logout
app.get('/logout', (req, res)=>{
  req.session.destroy( err =>{
    if(!err) res.send({status:'Logout ok'})
    else res.send({ status: 'Logout ERROR', body: err})
  })
  })

  //Login
  app.get('/login', (req, res)=>{
    const {username, password} = req.query
    if( username !== 'admin'|| password !== 'admin'){
      res.status(401).send({error: "Usuario o contraseña incorrectos"})
      return
    }
    req.session.user = username
    req.session.admin = true
    res.send({login : 'ok'})
  })

app.get('/autorizado', auth,(req,res)=>{
  res.send({autorizado: 'ok'})
})







// Midleware de errores
app.use((err, req, res, next) => {
  if (err.message) {
    return res.status(400).send({
      error: err.message
    })
  }
  res.status(500).send({ err })
})
