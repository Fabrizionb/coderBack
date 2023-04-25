import express from 'express'
import fileDirname from './utils/fileDirName.js'
import cookieParser from 'cookie-parser'
import { create } from 'express-handlebars'
import helpers from './lib/helpers.handlebars.js'
import viewsRoute from './routes/views.route.js'
import configureSocket from './socket/configure-socket.js'
import mongoose from 'mongoose'
import config from './data.js'
import session from 'express-session'
import MongoStore from 'connect-mongo'
import routes from './routes/index.js'
import { configurePassport } from './config/passport.config.js'
import passport from 'passport'

const { PORT, MONGO_URI, COOKIE_SECRET } = config
const { __dirname } = fileDirname(import.meta)
const app = express()
const httpServer = app.listen(PORT, () => console.log(`escuchando puerto ${PORT}`))

// config socket.io
configureSocket(httpServer)

// Config Session
app.use(
  session({
    secret: COOKIE_SECRET,
    resave: true,
    saveUninitialized: true,
    cookie: {
      secure: false, // Set to true if using HTTPS
      httpOnly: true,
      maxAge: 1000 * 60 * 60 * 24 // 1 day
    },
    store: new MongoStore({
      mongoUrl: MONGO_URI,
      ttl: 24 * 60 * 60 // session TTL in seconds
    })
  })
)
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

app.use(express.static(__dirname + '/public'))
app.use('/', viewsRoute)
app.use('/api', routes)
// Mongoose
mongoose.connect(MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
// Passport
configurePassport()
app.use(passport.initialize())
app.use(passport.session)

// Midleware de errores
app.use((err, req, res, next) => {
  if (err.message) {
    return res.status(400)
  }
  res.status(500).send({ err })
})
