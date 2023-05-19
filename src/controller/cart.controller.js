// Servicios de MongoDB.
// import CartService from '../Dao/services/cart.service.mjs'
// import UserService from '../Dao/services/user.service.mjs'
// import ProductService from '../Dao/services/product.service.mjs'
// import TicketService from '../Dao/services/ticket.service.mjs'
// Servicios de FileSystem.
// import CartService from '../Dao/filesystem/cart.service.mjs'
// import UserService from '../Dao/filesystem/user.service.mjs'
// import ProductService from '../Dao/filesystem/product.service.mjs'
// import TicketService from '../Dao/filesystem/ticket.service.mjs'
import DaoFactory from '../Dao/DaoFactory.mjs'
/* eslint-disable */

class CartController {
  #CartService
  #UserService
  #ProductService
  #TicketService

  constructor () {
    this.initializeServices();
  }
  async initializeServices() {
    this.#CartService = await DaoFactory.getDao('cart');
    this.#UserService = await DaoFactory.getDao('user');
    this.#ProductService = await DaoFactory.getDao('product');
    this.#TicketService = await DaoFactory.getDao('ticket');
    
  }
  async findAll (req, res, next) {
    try {
      const carts = await this.#CartService.get()
      if (!carts) {
        res.status(404).json({ error: 'Carts not found' })
      } else {
        // return new OkResponse(res, { carts })
        res.status(200).json(carts)
      }
    } catch (error) {
      next(error)
    }
  }

  async findOne (req, res, next) {
    const { id } = req.params
    try {
      const cart = await this.#CartService.getById({ _id: id })
      if (!cart) {
        res.status(404).json({ error: `Cart with id ${id} not found` })
        return
      } else {
        res.status(200).json(cart)
      }
    } catch (error) {
      next(error)
    }
  }

  async create (req, res, next) {
    try {
      const carts = await this.#CartService.create([{}])
      res.status(200).json({ carts })
    } catch (error) {
      next(error)
    }
  }

  async addProduct (req, res, next) {
    const { cid } = req.params
    const { pid } = req.params
    try {
      const cart = await this.#CartService.getById({ _id: cid })
      const product = cart.products.find(
        (product) => product.product._id.toString() === pid
      )
      if (!product) {
        const newProduct = { quantity: 1, product: pid }
        console.log('nuevo producto agregado')
        cart.products.push(newProduct)
        res.status(201).json(newProduct)
      } else {
        console.log('producto actualizado')
        product.quantity += 1
        res.status(201).json(product)
      }
      await cart.save()
    } catch (error) {
      next(error)
    }
  }

  async deleteAll (req, res, next) {
    const { cid } = req.params
    try {
      const result = await this.#CartService.findOneAndUpdate(
        { _id: cid },
        { $set: { products: [] } },
        { new: true }
      )
      if (!result) {
        res.status(404).json({ error: `Cart with id ${cid} not found` })
        return
      }
      res
        .status(200)
        .json({ message: `Products deleted from cart with id ${cid}` })
    } catch (error) {
      next(error)
    }
  }

  async deleteOne (req, res, next) {
    const { cid, pid } = req.params
    try {
      const result = await this.#CartService.findOneAndUpdate(
        { _id: cid },
        { $pull: { products: { product: pid } } },
        { new: true }
      )
      if (!result) {
        res.status(404).json({ error: `Cart with id ${cid} not found` })
        return
      }
      res.status(200).json({
        message: `Product with id ${pid} deleted from cart with id ${cid}`
      })
    } catch (error) {
      next(error)
    }
  }

  async updateQuantity (req, res, next) {
    const { cid, pid } = req.params
    const { quantity } = req.body
    try {
      const result = await this.#CartService.findOneAndUpdate(
        { _id: cid, 'products.product': pid },
        { $set: { 'products.$.quantity': quantity } },
        { new: true }
      )
      if (!result) {
        res.status(404).json({ error: `Cart with id ${cid} not found` })
        return
      }
      res.status(200).json({
        message: `Product with id ${pid} updated to quantity ${quantity} in cart with id ${cid}`
      })
    } catch (error) {
      next(error)
    }
  }

  async purchase (req, res, next) {
    const { cid } = req.params
    try {
      const cart = await this.#CartService.getById({ _id: cid })
      if (!cart) {
        res.status(404).json({ error: `Cart with id ${cid} not found` })
        return
      }
      const user = await this.#UserService.findByCartId(cid)
      const purchaser = user.email

      // Contenedores.
      const purchasableProducts = []
      const nonPurchasableProducts = []

      // Verificar el stock de cada producto.
      for (const item of cart.products) {
        const idString = item.product._id.toString()
        const product = await this.#ProductService.findById( {_id : idString})
        if (product.stock >= item.quantity) {
          // Si hay stock, actualizar el stock y agregar el producto a los productos comprables.
          await this.#ProductService.updateProductStock(product._id, item.quantity)
          purchasableProducts.push(item)
        } else {
          // Si no hay stock, agregar el producto a los productos no comprables.
          nonPurchasableProducts.push(item)
        }
      }

      // Calcular el monto total de los productos que se pueden comprar.
      const amount = purchasableProducts.reduce((total, item) => total + (item.product.price * item.quantity), 0)
      // Generar un ticket con los productos que se pueden comprar.
      const ticketData = {
        amount,
        purchaser,
        cartId: cid,
        purchased_products: purchasableProducts
      }
      await this.#TicketService.create(ticketData)

      // Actualizar el carrito para que sólo contenga los productos que no se pudieron comprar.
      cart.products = nonPurchasableProducts
      await cart.save()
      await this.#CartService.sendPurchaseMail(purchaser)
      res.status(200).json({
        message: 'Purchase completed',
        nonPurchasableProducts: nonPurchasableProducts.map(item => item.product._id)
      })
    } catch (error) {
      next(error)
    }
  }
}

const controller = new CartController()
export default controller
