import express from 'express'
import productsRoute from './routes/products.route.js'
import cartRoute from './routes/cart.route.js'
import fileDirname from '../src/utils/fileDirName.js'
import cookieParser from 'cookie-parser'
import { create } from 'express-handlebars'
// import helpers from './lib/helpers.handlebars.js'
import viewsRoute from './routes/views.route.js'

const app = express()
const hbs = create({
  partialsDir: ['views/partials']

})

const { __dirname } = fileDirname(import.meta)

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

// Midleware de errores
app.use((err, req, res, next) => {
  console.error({ err })
  res.status(500).json({ err: 'Error' })
  next()
})

const port = 8080
app.listen(port, () => console.log(`escuchando puerto ${port}`))
