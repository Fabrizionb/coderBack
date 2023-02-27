import { Router } from 'express'
import CartManager from '../../src/class/cartManager.js'
import ProductManager from '../../src/class/productManager.js'
// import { validateProduct, validarProductPartial } from '../../data/valid.js'

const route = Router()
const cartManager = new CartManager('./data/cart.json')
const productManager = new ProductManager('./data/products.json')

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

route.post('/', async (req, res) => {
  try {
    const cartCreated = await cartManager.addCart()
    res.status(201).send({ cartCreated })
  } catch {
    res.status(500).send('Error creating cart')
  }
})

route.post('/:cid/product/:pid', async (req, res) => {
  try {
    const { cid, pid } = req.params
    const cart = await cartManager.getCartById(cid)
    const product = await productManager.getById(pid)

    if (!product) {
      return res.status(404).json({ error: `No product found with id ${pid}.` })
    }
    const productInCart = cart.products.find((cart) => cart.products === product.id)

    if (productInCart) {
      productInCart.quantity += 1
    } else {
      cart.products.push({ product: product.id, quantity: 1 })
    }
    await cartManager.updateById(cid, cart)
    res.status(200).json(`Product ${pid} added to cart ${cid}.`)
  } catch (error) {
    res.status(500).json({ error: error.message, pta: 'catch cartRoute' })
  }
})
export default route
