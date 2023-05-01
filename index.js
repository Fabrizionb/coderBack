import express from 'express'
// import fileDirname from './src/utils/fileDirName.js'
import cookieParser from 'cookie-parser'
import { create } from 'express-handlebars'
import helpers from './src/lib/helpers.handlebars.js'
import viewsRoute from './src/routes/views.route.js'
import configureSocket from './src/socket/configure-socket.js'
import mongoose from 'mongoose'
import config from './data.js'
import session from 'express-session'
import MongoStore from 'connect-mongo'
import routes from './src/routes/index.js'
import { configurePassport } from './src/config/passport.config.js'
import passport from 'passport'
import path from 'path'
import fileDirname from './src/utils/fileDirName.js'

const { PORT, MONGO_URI, COOKIE_SECRET } = config
const { __dirname } = fileDirname(import.meta)
const app = express()
const httpServer = app.listen(PORT, () => console.log(`Escuchando en el puerto ${PORT}`))

// Configurar socket.io
configureSocket(httpServer)

// Configurar sesión
app.use(
  session({
    secret: COOKIE_SECRET,
    resave: true,
    saveUninitialized: true,
    cookie: {
      secure: false, // Establece en true si estás usando HTTPS
      httpOnly: true,
      maxAge: 1000 * 60 * 60 * 24 // 1 día
    },
    store: MongoStore.create({
      mongoUrl: MONGO_URI,
      ttl: 24 * 60 * 60 // TTL de la sesión en segundos
    })
  })
)
app.use(cookieParser(COOKIE_SECRET))
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

// Configurar Handlebars
const hbs = create({
  partialsDir: [path.join(__dirname, 'src', 'views', 'partials')],
  helpers
})

app.engine('handlebars', hbs.engine)
app.set('views', path.join(__dirname, 'src', 'views'))
app.set('view engine', 'handlebars')

app.use(express.static(path.join(__dirname, 'src', 'public')))
app.use('/', viewsRoute)
app.use('/api', routes)

// Conexión a Mongoose
mongoose.connect(MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})

// Middleware de Passport
configurePassport()
app.use(passport.initialize())
app.use(passport.session())

// Middleware de errores
app.use((err, req, res, next) => {
  if (err.message) {
    return res.status(400)
  }
  res.status(500).send({ err })
})
