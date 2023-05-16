import CartService from '../services/cart.service.mjs'
import DaoFactory from '../Dao/factory.mjs'

class CartController {
  #service
  constructor (service) {
    this.#service = service
  }

  async findAll (req, res, next) {
    try {
      const carts = await this.#service.find()
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
      const cart = await this.#service.findOne({ _id: id })
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
      const carts = await this.#service.create([{}])
      res.status(200).json({ carts })
    } catch (error) {
      next(error)
    }
  }

  async addProduct (req, res, next) {
    const { cid } = req.params
    const { pid } = req.params
    try {
      const cart = await this.#service.findById({ _id: cid })
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

  // async addProduct (req, res, next) {
  //   const { cid } = req.params
  //   const { pid } = req.params
  //   try {
  //     const cart = await cartModel.findOne({ _id: cid })
  //     const product = cart.products.find(
  //       (product) => product.product.toString() === pid
  //     )

  //     if (!product) {
  //       const newProduct = { quantity: 1, product: pid }
  //       cart.products.push(newProduct)
  //       await cartModel.updateOne({ _id: cid }, cart)
  //       res.status(201).json(newProduct)
  //     } else {
  //       product.quantity += 1
  //       await cartModel.updateOne({ _id: cid }, cart)
  //       res.status(201).json(product)
  //     }
  //   } catch (error) {
  //     next(error)
  //   }
  // }

  async deleteAll (req, res, next) {
    const { cid } = req.params
    try {
      const result = await this.#service.findOneAndUpdate(
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
      const result = await this.#service.findOneAndUpdate(
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
      const result = await this.#service.findOneAndUpdate(
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
}

const controller = new CartController(new CartService())
export default controller

// const dao = await DaoFactory.getDao() // Obtengo DAO
// const service = new CartService(dao) // nuevo CartService con DAO
// const controller = new CartController(service) // nuevo CartController con el service

// export default controller
