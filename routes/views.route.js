import { Router } from 'express'
import productManager from '../Dao/controller/product.manager.js'
import productModel from '../Dao/models/product.model.js'
import cartModel from '../Dao/models/cart.model.js'
import util from '../utils/view.util.js'
/* eslint-disabled */
const route = Router()

// Ruta para los productos
route.get('/', async (req, res, next) => {
  const query = req.query
  const sort = {}
  // Verificar si se ha enviado un parámetro de ordenamiento
  sort[query.sort] = query.order === 'desc' ? -1 : 1
  if (query.sort === 'price' && query[query.sort]) {
    sort[query.sort] = sort[query.sort] * parseInt(query[query.sort])
  }
  // Crear el objeto de la consulta
  const conditions = {}
  if (query.category) {
    conditions.category = query.category
  }
  if (query.status) {
    conditions.status = query.status === 'true'
  }
  try {
    const products = await productModel.paginate(
      conditions,
      {
        page: query.page ?? 1,
        limit: query.limit ?? 10,
        lean: true,
        sort
      }
    )
    if (!util.isValidPage(query.page, products.totalPages)) {
      res.status(404).render('404', {
        title: 'Invalid page number',
        msg: `Page number '${query.page}' is invalid for this query`
      })
      return
    }
    if (!products) {
      res.status(404).render('404', {
        title: 'Products not found', msg: 'Products not Found'
      })
    } else {
      res.status(200).render('index', {
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
      res.status(404).render('404', { msg: `The product with id: ${pid} you’re looking for doesn’t exist`, title: 'Product not Found' })
      return
    } else {
      const product = {
        ...data._doc,
        _id: data._doc._id.toString()
      }
      res.status(200).render('product', { titulo: 'List of Products', data: product })
    }
  } catch (error) {
    next(error)
  }
})

// ruta para ver el carrito
route.get('/view/cart/:cid', async (req, res, next) => {
  const { cid } = req.params
  const result = await cartModel.findById(cid).populate('products.product')
  try {
    if (!result) {
      res.status(404).render('404', { msg: `The cart with id: ${cid} you’re looking for doesn’t exist`, title: 'Cart not Found' })
      return
    }
    const cart = result.toObject()
    res.status(200).render('cart', { titulo: 'Shopping Cart', cart })
  } catch (error) {
    next(error)
  }
})

// Ruta para ver los productos en tiempo real
route.get('/realtimeproducts', async (req, res, next) => {
  const data = await productManager.find()
  try {
    if (!data) {
      res.status(404).render('404', {
        title: 'Products not found', msg: 'Products not Found'
      })
    } else {
      res.status(200).render('realTimeProducts', { titulo: 'Listado de Productos', data })
    }
  } catch (error) {
    next(error)
  }
})

// Ruta para ver el chat en tiempo real
route.get('/chat', async (req, res, next) => {
  try {
    res.status(200).render('chat', { title: 'Live Chat' })
  } catch (error) {
    next(error)
  }
})
export default route
