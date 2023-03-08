
import { Router } from 'express'
import ProductManager from '../controller/productManager.js'

const productManager = new ProductManager('./data/products.json')

const route = Router()

// Ruta estatica para los productos
route.get('/', async (req, res) => {
  const data = await productManager.readProducts()

  res.render('index', { title: 'Listado de Productos', data })
})

// Ruta vieja para cargar productos
// route.get('/register', async (req, res) => {
//   res.render('register', { titulo: 'Listado de Productos' })
// })

// ruta para ver cada uno de los productos
route.get('/view/product/:pid', async (req, res) => {
  const pid = req.params.pid
  const product = await productManager.getProductsById(pid)
  try {
    if (!product) {
      res.render('404', { id: pid })
      return
    } else {
      res.render('product', { titulo: 'Listado de Productos', product })
    }
  } catch (error) {
    throw new Error(error.message)
  }
})

// Ruta para ver los productos en tiempo real
route.get('/realtimeproducts', async (req, res) => {
  const data = await productManager.readProducts()
  res.render('realTimeProducts', { titulo: 'Listado de Productos', data })
})

export default route
