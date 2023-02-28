import { Router } from 'express'
import CartManager from '../../src/controller/cartManager.js'

const route = Router()
const cartManager = new CartManager('./data/cart.json')

route.post('/', async (req, res) => {
  res.send(await cartManager.addCart())
})

route.get('/', async (req, res) => {
  try {
    res.send(await cartManager.readCart())
  } catch (error) {
    res.status(500).send(error.message, 'Error get')
  }
})

route.get('/:id', async (req, res) => {
  const id = req.params.id
  try {
    res.send(await cartManager.getCartById(id))
  } catch (error) {
    res.status(500).send(error.message, 'Error get')
  }
})

route.post('/:cid/product/:pid', async (req, res) => {
  const cid = req.params.cid
  const pid = req.params.pid
  try {
    res.send(await cartManager.addProductInCart(cid, pid))
  } catch (error) {
    res.status(500).send(error.message, 'Error post')
  }
})

export default route
