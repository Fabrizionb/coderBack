import DaoFactory from '../Dao/DaoFactory.mjs'
import CustomError from '../errors/custom.error.mjs'
/* eslint-disable */

class CartController {
  #CartService
  #UserService
  #ProductService
  #TicketService

  constructor() {
    this.initializeServices();
  }
  async initializeServices() {
    this.#CartService = await DaoFactory.getDao('cart');
    this.#UserService = await DaoFactory.getDao('user');
    this.#ProductService = await DaoFactory.getDao('product');
    this.#TicketService = await DaoFactory.getDao('ticket');

  }
  async findAll(req, res, next) {
    try {
      const carts = await this.#CartService.get()
      if (!carts) {
        throw CustomError.createError({
          name: 'Not Found',
          cause: new Error('Carts not found'),
          message: 'Carts not found',
          code: 104,
        })
      } else {
        res.okResponse(carts)
      }
    } catch (error) {
      if (error instanceof CustomError) {
        next(error);
      } else {
        next(CustomError.createError({
          name: 'Server Error',
          cause: error,
          message: 'Failed to fetch carts',
          code: 500,
        }))
      }
    }
  }

  async findOne(req, res, next) {
    const { id } = req.params
    try {
      const cart = await this.#CartService.getById({ _id: id })
      if (!cart) {
        throw CustomError.createError({
          name: 'Not Found',
          cause: new Error(`Cart with id ${id} not found`),
          message: `Cart with id ${id} not found`,
          code: 104,
        })
        return
      } else {
        res.okResponse(cart)
      }
    } catch (error) {
      if (error instanceof CustomError) {
        next(error);
      } else {
        next(CustomError.createError({
          name: 'Server Error',
          cause: error,
          message: `Failed to fetch cart with id ${id}`,
          code: 500,
        }))
      }
    }
  }

  async create(req, res, next) {
    try {
      const newCart = await this.#CartService.create([{}])
      if (!newCart) {
        throw CustomError.createError({
          name: 'Error creating cart',
          cause: new Error(`Failed to create cart`),
          message: `Failed to create cart`,
          code: 208,
        })
        return
      }
      res.okResponse({ carts: newCart })
    } catch (error) {
      if (error instanceof CustomError) {
        next(error);
      } else {
        next(CustomError.createError({
          name: 'Server Error',
          cause: error,
          message: 'Failed to create cart',
          code: 500,
        }))
      }
    }
  }

  async addProduct(req, res, next) {
    const { cid } = req.params
    const { pid } = req.params
    try {
      const cart = await this.#CartService.getById({ _id: cid })
      const product = cart.products.find(
        (product) => product.product._id.toString() === pid
      )
      if (!product) {
        const newProduct = { quantity: 1, product: pid }
        cart.products.push(newProduct)
        res.okResponse(newProduct)
      } else {
        product.quantity += 1
        res.okResponse(product)
      }
      await cart.save()
    } catch (error) {
      if (error instanceof CustomError) {
        next(error);
      } else {
        next(CustomError.createError({
          name: 'Server Error',
          cause: error,
          message: 'Failed to add product to cart',
          code: 500,
        }))
      }
    }
  }

  async deleteAll(req, res, next) {
    const { cid } = req.params
    try {
      const result = await this.#CartService.findOneAndUpdate(
        { _id: cid },
        { $set: { products: [] } },
        { new: true }
      )
      if (!result) {
        throw CustomError.createError({
          name: 'Not Found',
          cause: new Error(`Cart with id ${cid} not found`),
          message: `Cart with id ${cid} not found`,
          code: 104,
        })
      }
      res.okResponse({ message: `Products deleted from cart with id ${cid}` })
    } catch (error) {
      if (error instanceof CustomError) {
        next(error);
      } else {
        next(CustomError.createError({
          name: 'Server Error',
          cause: error,
          message: `Failed to delete all products from cart with id ${cid}`,
          code: 500,
        }))
      }
    }
  }

  async deleteOne(req, res, next) {
    const { cid, pid } = req.params
    try {
      const result = await this.#CartService.findOneAndUpdate(
        { _id: cid },
        { $pull: { products: { product: pid } } },
        { new: true }
      )
      if (!result) {
        throw CustomError.createError({
          name: 'Not Found',
          cause: new Error(`Cart with id ${cid} not found`),
          message: `Cart with id ${cid} not found`,
          code: 104,
        })
      }
      res.okResponse({
        message: `Product with id ${pid} deleted from cart with id ${cid}`
      })
    } catch (error) {
      if (error instanceof CustomError) {
        next(error);
      } else {
        next(CustomError.createError({
          name: 'Server Error',
          cause: error,
          message: `Failed to delete product with id ${pid} from cart with id ${cid}`,
          code: 500,
        }))
      }
    }
  }

  async updateQuantity(req, res, next) {
    const { cid, pid } = req.params
    const { quantity } = req.body
    try {
      const result = await this.#CartService.findOneAndUpdate(
        { _id: cid, 'products.product': pid },
        { $set: { 'products.$.quantity': quantity } },
        { new: true }
      )
      if (!result) {
        throw CustomError.createError({
          name: 'Not Found',
          cause: new Error(`Cart with id ${cid} not found`),
          message: `Cart with id ${cid} not found`,
          code: 104,
        })
      }
      res.okResponse({
        message: `Product with id ${pid} updated to quantity ${quantity} in cart with id ${cid}`
      })
    } catch (error) {
      if (error instanceof CustomError) {
        next(error);
      } else {
        next(CustomError.createError({
          name: 'Server Error',
          cause: error,
          message: `Failed to update quantity for product with id ${pid} in cart with id ${cid}`,
          code: 500,
        }))
      }
    }
  }

  async purchase(req, res, next) {
    const { cid } = req.params
    try {
      const cart = await this.#CartService.getById({ _id: cid })
      if (!cart) {
        throw CustomError.createError({
          name: 'Not Found',
          cause: new Error(`Cart with id ${cid} not found`),
          message: `Cart with id ${cid} not found`,
          code: 104,
        })
      }
      const user = await this.#UserService.findByCartId(cid)
      if (!user) {
        throw CustomError.createError({
          name: 'Not Found',
          cause: new Error(`User with cart id ${cid} not found`),
          message: `User with cart id ${cid} not found`,
          code: 104,
        })
      }
      const purchaser = user ? user.email : null

      // Contenedores.
      const purchasableProducts = []
      const nonPurchasableProducts = []

      // Verificar el stock de cada producto.
      for (const item of cart.products) {
        const idString = item.product._id.toString()
        const product = await this.#ProductService.findById({ _id: idString })
        if (!product) {
          CustomError.createError({
            name: 'Not Found',
            cause: new Error(`Product not found`),
            message: `Product with id ${idString}`,
            code: 104,
          })
          return
        }
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
      const newTicket = await this.#TicketService.create(ticketData)
      if (!newTicket) {
        throw CustomError.createError({
          name: 'Error on ticket creation',
          cause: new Error(`Failed to create ticket`),
          message: `Failed to create ticket`,
          code: 208,
        })
        return
      }

      // Actualizar el carrito para que sólo contenga los productos que no se pudieron comprar.
      cart.products = nonPurchasableProducts;
      const updateCart = await this.#CartService.updateCart(cart);

      if (!updateCart) {
        throw CustomError.createError({
          name: 'Error on cart update',
          cause: new Error(`Failed to update cart with id ${cid}`),
          message: `Failed to update cart with id ${cid}`,
          code: 209,
        })
      }

      const mailSent = await this.#CartService.sendPurchaseMail(purchaser)
      if (!mailSent) {
        throw CustomError.createError({
          name: 'Error on mail sending',
          cause: new Error(`Failed to send purchase mail to ${purchaser}`),
          message: `Failed to send purchase mail to ${purchaser}`,
          code: 211,
        })
      }
      res.okResponse({
        message: 'Purchase completed',
        nonPurchasableProducts: nonPurchasableProducts.map(item => item.product._id)
      })
    } catch (error) {
      if (error instanceof CustomError) {
        next(error);
      } else {
        next(CustomError.createError({
          name: 'Server Error',
          cause: error,
          message: `Failed to complete purchase for cart with id ${cid}`,
          code: 500,
        }))
      }
    }
  }
}

const controller = new CartController()
export default controller
