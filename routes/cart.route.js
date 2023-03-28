import { Router } from 'express'
import cartManager from '../Dao/controller/cart.manager.js'
import cartModel from '../Dao/models/cart.model.js'

const route = Router()

route.get('/', async (req, res, next) => {
  try {
    const carts = await cartManager.find()
    if (!carts) {
      res.status(404).json({ error: 'Carts not found' })
    } else {
      res.status(200).json(carts)
    }
  } catch (error) {
    next(error)
  }
})

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

route.post('/', async (req, res, next) => {
  try {
    const carts = await cartModel.create([{}])
    res.status(200).json({ carts })
  } catch (error) {
    next(error)
  }
})

route.delete('/:id', async (req, res, next) => {
  const { id } = req.params
  try {
    const cart = await cartManager.findOne({ _id: id })
    if (!cart) {
      res.status(404).json({ error: `Cart with id ${id} not found` })
      return
    } else {
      await cartManager.deleteOne(id)
      res.status(200).json({ message: `Cart with id ${id} deleted` })
    }
  } catch (error) {
    next(error)
  }
})

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

export default route
