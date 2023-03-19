// import FileManager from '../controller/fileManager.js'
// const fileManager = new FileManager('./data/products.json')
import { Router } from 'express'
import { userModel as fileManager } from '../models/user.model.js'

const route = Router()

// Ruta estatica para los productos
route.get('/', async (req, res) => {
  const data = await fileManager.readFile()

  res.render('index', { title: 'Listado de Productos', data })
})

// ruta para ver cada uno de los productos
route.get('/view/product/:pid', async (req, res) => {
  const pid = req.params.pid
  const product = await fileManager.getEntityById(pid)
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
  const data = await fileManager.readFile()
  res.render('realTimeProducts', { titulo: 'Listado de Productos', data })
})

export default route
