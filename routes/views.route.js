import { Router } from 'express'
import ProductManager from '../controller/productManager.js'

const productManager = new ProductManager('./data/products.json')

const route = Router()

route.get('/', async (req, res) => {
  const data = await productManager.readProducts()

  res.render('index', { title: 'Listado de Productos', data })
})

route.get('/register', async (req, res) => {
  res.render('register', { titulo: 'Listado de Productos' })
})

route.get('/view/product/:pid', async (req, res) => {
  const pid = req.params.pid
  const product = await productManager.getProductsById(pid)
  // try {
  //   if (!product) {
  //     res.status(404).json({ error: `Product with id ${pid} not found` })
  //     return
  //   }
  //   res.status(200).json({ product })
  // } catch (error) {
  //   res.status(500).json({ error: error.message })
  // }
  res.render('product', { titulo: 'Listado de Productos', product })
})

export default route
