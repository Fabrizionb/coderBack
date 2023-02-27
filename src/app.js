import express from 'express'
import productsRoute from './routes/products.route.js'
import cartRoute from './routes/cart.route.js'
const app = express()
app.use(express.urlencoded({ extended: true }))
app.use(express.json())

app.use('/products', productsRoute)
app.use('/cart', cartRoute)
const port = 8080
app.listen(port, () => console.log('escuchando puerto 8080'))
