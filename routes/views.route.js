import { Router } from 'express'
import productManager from '../Dao/controller/product.manager.js'
import cartManager from '../Dao/controller/cart.manager.js'
import productModel from '../Dao/models/product.model.js'
// import cartModel from '../Dao/models/cart.model.js'

const route = Router()

// Ruta estatica para los productos
route.get('/', async (req, res, next) => {
  const query = req.query
  const sort = {}
  // Verificar si se ha enviado un parámetro de ordenamiento
  if (query.sort && ['title', 'price'].includes(query.sort)) {
    sort[query.sort] = query.order === 'desc' ? -1 : 1
  }
  try {
    const products = await productModel.paginate(
      query.category ? { category: query.category } : {},
      {
        page: query.page ?? 1,
        limit: query.limit ?? 10,
        lean: true,
        sort
      }
    )
    if (!products) {
      res.status(404).json({ error: 'Products not found' })
    } else {
      res.render('index', {
        title: 'Listado de Productos',
        products: products.docs,
        pages: products.totalPages,
        page: products.page,
        prev: products.prevPage,
        next: products.nextPage,
        hasPrevPage: products.hasPrevPage,
        hasNextPage: products.hasNextPage,
        sort: query.sort ?? '',
        order: query.order ?? 'asc'
      })
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

// ruta para ver el carrito
route.get('/view/cart/:cid', async (req, res, next) => {
  const { cid } = req.params
  const result = await cartManager.find({ _id: cid })
  const cart = result[0]

  try {
    if (!result) {
      res.render('404', { id: cid })
      return
    } else {
      res.render('cart', { titulo: 'Shopping Cart', cart })
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
  res.render('chat', { titulo: 'Live Chat' })
})
export default route
