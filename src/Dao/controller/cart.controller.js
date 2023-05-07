import cartModel from '../models/cart.model.js'

class CartController {
  async findAll (req, res, next) {
    try {
      const carts = await cartModel.find()
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
      const cart = await cartModel.findOne({ _id: id })
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
      const carts = await cartModel.create([{}])
      res.status(200).json({ carts })
    } catch (error) {
      next(error)
    }
  }

  async addProduct (req, res, next) {
    const { cid } = req.params
    const { pid } = req.params
    try {
      const cart = await cartModel.findOne({ _id: cid })
      const product = cart.products.find(
        (product) => product.product.toString() === pid
      )

      if (!product) {
        const newProduct = { quantity: 1, product: pid }
        cart.products.push(newProduct)
        await cartModel.updateOne({ _id: cid }, cart)
        res.status(201).json(newProduct)
      } else {
        product.quantity += 1
        await cartModel.updateOne({ _id: cid }, cart)
        res.status(201).json(product)
      }
    } catch (error) {
      next(error)
    }
  }

  async deleteAll (req, res, next) {
    const { cid } = req.params
    try {
      const cart = await cartModel.findById({ _id: cid })
      if (!cart) {
        res.status(404).json({ error: `Cart with id ${cid} not found` })
        return
      }
      cart.products = []
      await cart.save()
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
      const cart = await cartModel.findById(cid)
      if (!cart) {
        res.status(404).json({ error: `Cart with id ${cid} not found` })
        return
      }
      const productIndex = cart.products.findIndex(
        (p) => p.product.toString() === pid
      )
      if (productIndex === -1) {
        res
          .status(404)
          .json({ error: `Product with id ${pid} not found in cart` })
        return
      }
      cart.products.splice(productIndex, 1)
      await cart.save()
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
      const cart = await cartModel.findById(cid)
      if (!cart) {
        res.status(404).json({ error: `Cart with id ${cid} not found` })
        return
      }
      const productIndex = cart.products.findIndex(
        (p) => p.product.toString() === pid
      )
      if (productIndex === -1) {
        res
          .status(404)
          .json({ error: `Product with id ${pid} not found in cart` })
        return
      }
      cart.products[productIndex].quantity = quantity
      await cart.save()
      res.status(200).json({
        message: `Product with id ${pid} updated to quantity ${quantity} in cart with id ${cid}`
      })
    } catch (error) {
      next(error)
    }
  }
}

const controller = new CartController()
export default controller
