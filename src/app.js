import express from 'express'
import productsRoute from './routes/products.route.js'
import cartRoute from './routes/cart.route.js'
import fileDirname from '../src/utils/fileDirName.js'
import cookieParser from 'cookie-parser'

const app = express()
const { __dirname } = fileDirname(import.meta)

app.use(express.urlencoded({ extended: true }))
app.use(express.json())
app.use(cookieParser())

app.use('/api/products', productsRoute)
app.use('/api/cart', cartRoute)
app.use(express.static(__dirname + '/public'))

// Midleware de errores
app.use((err, req, res, next) => {
  console.error({ err })
  res.status(500).json({ err: 'Error' })
  next()
})

const port = 8080
app.listen(port, () => console.log(`escuchando puerto ${port}`))
