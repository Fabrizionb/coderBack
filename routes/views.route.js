// import FileManager from '../controller/fileManager.js'
// const fileManager = new FileManager('./data/products.json')
// import { userModel as fileManager } from '../models/user.model.js'
import { Router } from 'express'
import { productModel } from '../models/product.model.js'

const route = Router()

// Ruta estatica para los productos
route.get('/', async (req, res) => {
  // const data = await fileManager.readFile()
  const data = await productModel.find()
  const products = data.map(product => {
    return {
      ...product._doc,
      _id: product._doc._id.toString()
    }
  })
  res.render('index', { title: 'Listado de Productos', data: products })
})

// ruta para ver cada uno de los productos
route.get('/view/product/:pid', async (req, res) => {
  const { pid } = req.params
  const data = await productModel.findOne({ _id: pid })

  console.log('data cruda', data)
  try {
    if (!data) {
      res.render('404', { id: pid })
      return
    } else {
      const product = {
        ...data._doc,
        _id: data._doc._id.toString()
      }
      console.log('data cocinada', product)
      res.render('product', { titulo: 'Listado de Productos', data: product })
    }
  } catch (error) {
    throw new Error(error.message)
  }
})

// Ruta para ver los productos en tiempo real
route.get('/realtimeproducts', async (req, res) => {
  // const data = await fileManager.readFile()
  const data = await productModel.find()
  const products = data.map(product => {
    return {
      ...product._doc,
      _id: product._doc._id.toString()
    }
  })
  res.render('realTimeProducts', { titulo: 'Listado de Productos', data: products })
})

export default route
