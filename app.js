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

const { PORT, MONGO_URI } = config

const { __dirname } = fileDirname(import.meta)
const app = express()

const httpServer = app.listen(PORT, () => console.log(`escuchando puerto ${PORT}`))

// config socket.io
configureSocket(httpServer)

const hbs = create({
  partialsDir: ['views/partials'],
  helpers
})

app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(cookieParser())

// Config Handlebars
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

// Midleware de errores
app.use((err, req, res, next) => {
  if (err.message) {
    return res.status(400).send({
      error: err.message
    })
  }
  res.status(500).send({ err })
})
