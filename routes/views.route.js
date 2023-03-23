import { Router } from 'express'
import productManager from '../Dao/controller/product.manager.js'

const route = Router()

// Ruta estatica para los productos

route.get('/', async (req, res, next) => {
  const data = await productManager.find()
  try {
    if (!data) {
      res.status(404).json({ error: 'Products not found' })
    } else {
      res.render('index', { title: 'Listado de Productos', data })
    }
  } catch (error) {
    next(error)
  }
})

// ruta para ver cada uno de los productos
route.get('/view/product/:pid', async (req, res, next) => {
  const { pid } = req.params
  const data = await productManager.findOne({ _id: pid })
  try {
    if (!data) {
      res.render('404', { id: pid })
      return
    } else {
      const product = {
        ...data._doc,
        _id: data._doc._id.toString()
      }
      res.render('product', { titulo: 'Listado de Productos', data: product })
    }
  } catch (error) {
    next(error)
  }
})

// Ruta para ver los productos en tiempo real
route.get('/realtimeproducts', async (req, res, next) => {
  const data = await productManager.find()
  res.render('realTimeProducts', { titulo: 'Listado de Productos', data })
})

// Ruta para ver el chat en tiempo real
route.get('/chat', async (req, res) => {
  res.render('chat', { titulo: 'Chat' })
})
export default route
