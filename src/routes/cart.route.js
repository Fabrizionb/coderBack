import { Router } from 'express'
import CartManager from '../../src/controller/cartManager.js'

const route = Router()
const cartManager = new CartManager('./data/cart.json')

route.post('/', async (req, res) => {
  try {
    const carts = await cartManager.readCart()
    res.status(200).json(carts)
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

route.get('/', async (req, res) => {
  try {
    const carts = await cartManager.readCart()
    res.status(200).json(carts)
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

route.get('/:id', async (req, res) => {
  const id = req.params.id
  try {
    const cart = await cartManager.getCartById(id)
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
  const cid = req.params.cid
  const pid = req.params.pid
  try {
    const updatedCart = await cartManager.addProductInCart(cid, pid)
    if (!updatedCart) {
      res.status(404).json({ error: `Cart with id ${cid} not found` })
    } else {
      res.status(201).json(updatedCart)
    }
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

export default route
