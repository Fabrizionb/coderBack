import { Router } from 'express'
import ProductManager from '../controller/productManager.js'

const productManager = new ProductManager('./data/products.json')

const route = Router()

route.get('/', async (req, res) => {
  const data = await productManager.readProducts()

  res.render('index', { titulo: 'Listado de Productos', data })
})

route.get('/register', async (req, res) => {
  res.render('register', { titulo: 'Listado de Productos' })
})

export default route
