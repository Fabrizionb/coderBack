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

const { __dirname } = fileDirname(import.meta)
const app = express()

const port = 8080
const httpServer = app.listen(port, () => console.log(`escuchando puerto ${port}`))

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

// Coneccion de Mongoose
mongoose.connect('mongodb+srv://fabrizio1007:Artura10@backendhouse.1cpbsvy.mongodb.net/mongoose?retryWrites=true&w=majority', {
  useNewUrlParser: true,
  useUnifiedTopology: true
})

// Midleware de errores
app.use((err, req, res, next) => {
  console.error({ err })
  res.status(500).json({ err: 'Error' })
  next()
})
