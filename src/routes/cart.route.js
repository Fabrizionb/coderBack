import { Router } from 'express'
import CartManager from '../../src/class/cartManager.js'
// import ProductManager from '../../src/class/productManager.js'
// import { validateProduct, validarProductPartial } from '../../data/valid.js'

const route = Router()
const cartManager = new CartManager('./data/cart.json')

route.post('/', async (req, res) => {
  try {
    const cartCreated = await cartManager.addCart()
    res.status(201).send({ cartCreated })
  } catch {
    res.status(500).send('Error creating cart')
  }
})
route.get('/', async (req, res) => {
  try {
    const carts = await cartManager.getCart()
    res.status(200).json(carts)
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

route.get('/:cid', async (req, res) => {
  const cid = req.params.cid

  try {
    const cart = await cartManager.getCartById(cid)

    if (cart) res.status(200).json(cart.products)
    else res.status(404).json({ error: `Not data found with id ${cid}.` })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

route.post('/:cid/product/:pid', async (req, res) => {
  try {
    const { cid, pid } = req.params
    const pidV = pid
    const cartCreated = await cartManager.updateById(cid, pidV)
    res.status(201).send(cartCreated)
  } catch (error) {
    res.status(500).send(error.message)
  }
})
export default route
