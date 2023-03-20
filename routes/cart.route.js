import { Router } from 'express'
// import CartManager from '../controller/cartManager.js'
import { cartModel } from '../models/cart.model.js'

const route = Router()
// const cartManager = new CartManager('./data/cart.json')

route.post('/', async (req, res) => {
  try {
    // const carts = await cartManager.readCart()
    const carts = await cartModel.create([{}])
    res.status(200).json({ carts })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

route.get('/', async (req, res) => {
  try {
    // const carts = await cartManager.readCart()
    const carts = await cartModel.find()
    if (!carts) {
      res.status(404).json({ error: 'Carts not found' })
    } else {
      res.status(200).json(carts)
    }
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

route.get('/:id', async (req, res) => {
  const { id } = req.params

  try {
    // const cart = await cartManager.getCartById(id)
    const cart = await cartModel.findOne({ _id: id })
    if (!cart) {
      res.status(404).json({ error: `Cart with id ${id} not found` })
    } else {
      res.status(200).json(cart)
    }
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

route.post('/:cid/product/:pid', async (req, res) => {
  const { cid } = req.params
  const { pid } = req.params

  try {
    const cart = await cartModel.findOne({ _id: cid })

    if (!cart) {
      return res.status(404).json({ error: `Cart with id ${cid} not found` })
    }

    const productInCart = cart.products.find(product => product._id.toString() === pid)

    if (productInCart) {
      console.log('Product found in cart: +1 to quantity', productInCart)
      await cartModel.updateOne({ _id: cid, 'products._id': pid }, { $inc: { 'products.$.quantity': 1 } })
    } else {
      console.log('Product not found in cart:')
      await cartModel.updateOne({ _id: cid }, { $push: { products: { _id: pid, quantity: 1 } } })
    }

    res.status(201).json(cart)
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

export default route
