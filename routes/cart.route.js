import { Router } from 'express'
import cartManager from '../Dao/controller/cart.manager.js'
import cartModel from '../Dao/models/cart.model.js'

const route = Router()

// Get All
route.get('/', async (req, res, next) => {
  try {
    const carts = await cartModel.find()
    if (!carts) {
      res.status(404).json({ error: 'Carts not found' })
    } else {
      res.status(200).json(carts)
    }
  } catch (error) {
    next(error)
  }
})

// Get one cart
route.get('/:id', async (req, res, next) => {
  const { id } = req.params
  try {
    const cart = await cartManager.find({ _id: id })
    if (!cart) {
      res.status(404).json({ error: `Cart with id ${id} not found` })
      return
    } else {
      res.status(200).json(cart)
    }
  } catch (error) {
    next(error)
  }
})

// Create a cart
route.post('/', async (req, res, next) => {
  try {
    const carts = await cartModel.create([{}])
    res.status(200).json({ carts })
  } catch (error) {
    next(error)
  }
})

// Delete a cart
// route.delete('/:id', async (req, res, next) => {
//   const { id } = req.params
//   try {
//     const cart = await cartManager.findOne({ _id: id })
//     if (!cart) {
//       res.status(404).json({ error: `Cart with id ${id} not found` })
//       return
//     } else {
//       await cartManager.deleteOne(id)
//       res.status(200).json({ message: `Cart with id ${id} deleted` })
//     }
//   } catch (error) {
//     next(error)
//   }
// })

route.post('/:cid/product/:pid', async (req, res, next) => {
  const { cid } = req.params
  const { pid } = req.params
  try {
    const cart = await cartModel.findOne({ _id: cid })
    const product = cart.products.find(product => product.product.toString() === pid)

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
})

// Eliminar un producto de un carrito
route.delete('/:cid/product/:pid', async (req, res, next) => {
  const { cid, pid } = req.params
  try {
    const cart = await cartModel.findById(cid)
    if (!cart) {
      res.status(404).json({ error: `Cart with id ${cid} not found` })
      return
    }
    const productIndex = cart.products.findIndex(p => p.product.toString() === pid)
    if (productIndex === -1) {
      res.status(404).json({ error: `Product with id ${pid} not found in cart` })
      return
    }
    cart.products.splice(productIndex, 1)
    await cart.save()
    res.status(200).json({ message: `Product with id ${pid} deleted from cart with id ${cid}` })
  } catch (error) {
    next(error)
  }
})

// Eliminar todos los productos de un carrito
route.delete('/:cid', async (req, res, next) => {
  const { cid } = req.params
  try {
    const cart = await cartModel.findById({ _id: cid })
    if (!cart) {
      res.status(404).json({ error: `Cart with id ${cid} not found` })
      return
    }
    cart.products = []
    await cart.save()
    res.status(200).json({ message: `Products deleted from cart with id ${cid}` })
  } catch (error) {
    next(error)
  }
})

// Modificar la cantidad del producto
route.put('/:cid/product/:pid', async (req, res, next) => {
  const { cid, pid } = req.params
  const { quantity } = req.body
  try {
    const cart = await cartModel.findById(cid)
    if (!cart) {
      res.status(404).json({ error: `Cart with id ${cid} not found` })
      return
    }
    const productIndex = cart.products.findIndex(p => p.product.toString() === pid)
    if (productIndex === -1) {
      res.status(404).json({ error: `Product with id ${pid} not found in cart` })
      return
    }
    cart.products[productIndex].quantity = quantity
    await cart.save()
    res.status(200).json({ message: `Product with id ${pid} updated to quantity ${quantity} in cart with id ${cid}` })
  } catch (error) {
    next(error)
  }
})

export default route
