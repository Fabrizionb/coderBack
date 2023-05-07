import cartModel from '../models/cart.model.js'
import productModel from '../models/product.model.js'
import userModel from '../models/user.model.js'
import util from '../../utils/view.util.js'
import jwtLib from 'jsonwebtoken'
import config from '../../../data.js'
import mongoose from 'mongoose'

class ViewController {
  async viewStore (req, res, next) {
    const { query } = req
    const cookie = util.cookieExtractor(req)
    if (!cookie) {
      res.redirect('/login')
      return
    }
    let decoded
    try {
      decoded = jwtLib.verify(cookie, config.JWT_SECRET)
    } catch (err) {
      console.error(err)
      res.redirect('/login')
      return
    }
    const userCart = decoded.cartId
    const user = await userModel.findById(decoded.userId)
    const userObj = user.toObject() // Convertimos el objeto user a un objeto plano
    const sort = util.createSortObject(query)
    const conditions = util.createConditionsObject(query)
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
          user: userObj
        })
      }
    } catch (error) {
      next(error)
    }
  }

  async viewProduct (req, res, next) {
    const { pid } = req.params
    if (!mongoose.isValidObjectId(pid)) {
      return res.status(400).render('404', {
        msg: 'Invalid Product Id',
        title: 'Product not Found'
      })
    }
    try {
      const data = await productModel.findOne({ _id: pid })
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
  }

  async viewCart (req, res, next) {
    try {
      const { cid } = req.params
      const cookie = util.cookieExtractor(req)
      // console.log(cookie);
      if (!cookie) {
        res.redirect('/login')
        return
      }
      let decoded
      try {
        decoded = jwtLib.verify(cookie, config.JWT_SECRET)
        // console.log(decoded);
      } catch (err) {
        console.error(err)
        res.redirect('/login')
        return
      }
      const userCartId = decoded.cartId
      const userId = decoded.userId
      if (!userId || !userCartId) {
        throw new Error('User or cart not found')
      }
      if (cid !== userCartId) {
        res.status(403).render('unauthorized', {
          msg: 'You are not authorized to view this cart',
          title: 'Unauthorized'
        })
        return
      }
      const result = await cartModel.findById(cid).populate('products.product')
      if (!result) {
        res.status(404).render('404', {
          msg: `The cart with id: ${cid} you’re looking for doesn’t exist`,
          title: 'Cart not Found'
        })
        return
      }
      const cartData = result.toObject()
      res
        .status(200)
        .render('cart', { titulo: 'Shopping Cart', cart: cartData })
    } catch (error) {
      next(error)
    }
  }

  async viewRealTime (req, res, next) {
    const data = await productModel.find()

    try {
      if (!data) {
        res.status(404).render('404', {
          title: 'Products not found',
          msg: 'Products not Found'
        })
      } else {
        const plainData = data.map((doc) => doc.toObject())
        res
          .status(200)
          .render('realTimeProducts', {
            titulo: 'Listado de Productos',
            data: plainData
          })
      }
    } catch (error) {
      next(error)
    }
  }

  async viewChat (req, res, next) {
    try {
      const cookie = util.cookieExtractor(req)
      let decoded
      try {
        decoded = jwtLib.verify(cookie, config.JWT_SECRET)
      } catch (err) {
        console.error(err)
        res.redirect('/login')
        return
      }
      const user = await userModel.findById(decoded.userId)
      const userObj = user.toObject()

      res
        .status(200)
        .render('chat', { title: 'Live Chat', role: userObj.role })
    } catch (error) {
      next(error)
    }
  }

  async viewRegister (req, res, next) {
    try {
      const cookie = util.cookieExtractor(req)
      if (cookie) {
        try {
          jwtLib.verify(cookie, config.JWT_SECRET)
          return res.redirect('/profile')
        } catch (err) {
          console.error(err)
        }
      }
      res.render('register')
    } catch (error) {
      next(error)
    }
  }

  async viewLogin (req, res, next) {
    try {
      const cookie = util.cookieExtractor(req)
      if (cookie) {
        try {
          jwtLib.verify(cookie, config.JWT_SECRET)
          return res.redirect('/profile')
        } catch (err) {
          console.error(err)
        }
      }
      res.render('login')
    } catch (error) {
      next(error)
    }
  }

  async viewForgot (req, res, next) {
    try {
      res.render('forgot-password')
    } catch (error) {
      next(error)
    }
  }

  async viewProfile (req, res, next) {
    const userId = req.user._id
    const cartId = req.user.cartId

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
  }
}

const controller = new ViewController()
export default controller
