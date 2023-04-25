import { Router } from 'express'
import productManager from '../Dao/controller/product.manager.js'
import productModel from '../Dao/models/product.model.js'
import cartModel from '../Dao/models/cart.model.js'
import util from '../utils/view.util.js'
// import auth from '../utils/auth.js'
// import isAdmin from '../utils/isAdmin.js'
import mongoose from 'mongoose'
import userModel from '../Dao/models/user.model.js'
import { authorization } from '../utils/auth.js'

const route = Router()

// Ruta para los productos
route.get('/', async (req, res, next) => {
  const query = req.query
  const userCart =
    req.session.passport &&
    req.session.passport.user &&
    req.session.passport.user.cartId
      ? req.session.passport.user.cartId
      : null
  const user =
    req.session.passport &&
    req.session.passport.user &&
    req.session.passport.user.userId
      ? req.session.passport.user.userId
      : null
  if (!user) {
    res.redirect('/login')
  }
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
    const products = await productModel.paginate(conditions, {
      page: query.page ?? 1,
      limit: query.limit ?? 10,
      lean: true,
      sort
    })
    if (!util.isValidPage(query.page, products.totalPages)) {
      res.status(404).render('404', {
        title: 'Invalid page number',
        msg: `Page number '${query.page}' is invalid for this query`
      })
      return
    }
    if (!products) {
      res.status(404).render('404', {
        title: 'Products not found',
        msg: 'Products not Found'
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
        order: query.order ?? 'asc',
        cartId: userCart,
        user
      })
    }
  } catch (error) {
    next(error)
  }
})

// ruta para ver cada uno de los productos
route.get('/view/product/:pid', async (req, res, next) => {
  const { pid } = req.params
  if (!mongoose.isValidObjectId(pid)) {
    return res
      .status(400)
      .render('404', { msg: 'Invalid Product Id', title: 'Product not Found' })
  }
  try {
    const data = await productManager.findOne({ _id: pid })
    if (!data) {
      return res.status(404).render('404', {
        msg: `The product with id: ${pid} you’re looking for doesn’t exist`,
        title: 'Product not Found'
      })
    }
    const product = {
      ...data._doc,
      _id: data._doc._id.toString()
    }
    return res
      .status(200)
      .render('product', { titulo: 'List of Products', data: product })
  } catch (error) {
    next(error)
  }
})

// ruta para ver el carrito
route.get('/view/cart/:cid', async (req, res, next) => {
  try {
    const { cid } = req.params
    const user = req.session.passport.user
    if (!user || !user.userId || !user.cartId) {
      throw new Error('User or cart not found')
    }
    // const cart = user.cartId._id
    const result = await cartModel.findById(cid).populate('products.product')
    if (!result) {
      res.status(404).render('404', {
        msg: `The cart with id: ${cid} you’re looking for doesn’t exist`,
        title: 'Cart not Found'
      })
      return
    }
    const cartData = result.toObject()
    res.status(200).render('cart', { titulo: 'Shopping Cart', cart: cartData })
  } catch (error) {
    next(error)
  }
})

// Ruta para ver los productos en tiempo real
route.get('/realtimeproducts', authorization('admin'),
  async (req, res, next) => {
    const data = await productManager.find()
    try {
      if (!data) {
        res.status(404).render('404', {
          title: 'Products not found',
          msg: 'Products not Found'
        })
      } else {
        res
          .status(200)
          .render('realTimeProducts', { titulo: 'Listado de Productos', data })
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

// Ruta para ver el formulario de registro
route.get('/register', (req, res, next) => {
  try {
    const email = req.session.user
    if (email) {
      return res.redirect('/profile')
    }
    res.render('register')
  } catch (error) {
    next(error)
  }
})

// Ruta para ver el formulario de login
route.get('/login', (req, res, next) => {
  try {
    const email = req.session.user
    if (email) {
      return res.redirect('/profile')
    }
    res.render('login')
  } catch (error) {
    next(error)
  }
})

// Ruta para recuperar la password
route.get('/forgot-password', (req, res, next) => {
  try {
    res.render('forgot-password')
  } catch (error) {
    next(error)
  }
})

// Ruta para ver el perfil
route.get('/profile', async (req, res, next) => {
  if (!req.session.passport || !req.session.passport.user) {
    return res.redirect('/login')
  }
  const userId = req.session.passport.user.userId
  const cartId = req.session.passport.user.cartId
  try {
    const user = await userModel.findOne({ _id: userId }).populate('cartId')
    const cart = await cartModel.findOne({ _id: cartId })
    if (!user) {
      res.redirect('/login')
    }
    const productsInCart = cart.products
    const cartLength = countProductsQuantity(productsInCart)
    function countProductsQuantity (productsInCart) {
      let totalQuantity = 0
      for (let i = 0; i < productsInCart.length; i++) {
        totalQuantity += productsInCart[i].quantity
      }
      return totalQuantity
    }
    const userObject = user.toObject() // Convertimos el objeto user a un objeto plano
    res.render('profile', { user: userObject, cartLength })
  } catch (error) {
    next(error)
  }
})
export default route
