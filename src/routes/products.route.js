import { Router } from 'express'
import ProductManager from '../controller/productManager.js'
import { validateProduct } from '../../data/valid.js'

const route = Router()
const productManager = new ProductManager('./data/products.json')

route.get('/', async (req, res) => {
  const { limit } = req.query
  const products = await productManager.readProducts()

  try {
    if (!products) {
      res.status(200).send({ error: 'Products not found' })
    } else {
      if (!limit) {
        res.status(200).send({ products })
      } else {
        const limited = products.slice(0, limit)
        res.status(200).send({ limited })
      }
    }
  } catch (error) {
    res.status(500).send(error.message, 'Error get')
  }
})

route.get('/:pid', async (req, res) => {
  const pid = req.params.pid

  try {
    const cart = await productManager.getProductsById(pid)
    if (!cart) {
      res
        .status(404).send({ error: `cart with id ${pid} not found` })
      return
    }
    res.status(200).send({ cart })
  } catch (error) {
    res.status(500).send(error.message, 'Error get')
  }
})

route.post('/', async (req, res) => {
  const product = req.body
  const isValid = validateProduct(product)

  try {
    if (!product) {
      res.status(200).send({ error: 'Product missing' })
      return
    } else if (!isValid) {
      res.status(400).send({ error: 'Invalid Data' })
      return
    } else {
      const idCreated = await productManager.addProducts(product)
      res.status(201).send({ idCreated })
      return
    }
  } catch (error) {
    res.status(500).send(error.message, 'Error post')
  }
})

route.put('/:id', async (req, res) => {
  const updateProduct = req.body

  try {
    const productById = await productManager.getProductsById(updateProduct.id)
    const isValid = validateProduct(updateProduct)
    if (!productById) res.status(404).send({ error: 'Product not found' })
    if (!isValid) res.status(404).send({ error: 'Invalid Data' })
    const id = req.params.id
    res.send(await productManager.updateProduct(id, updateProduct))
  } catch (error) {
    res.status(500).send(error.message, 'Error put')
  }
})

route.delete('/:pid', async (req, res) => {
  const pid = req.params.pid

  try {
    const product = await productManager.getProductsById(pid)
    if (!product) {
      res.status(404).send('Product not found')
      return
    }
    await productManager.deleteProduct(pid)
    res.send({ ok: true })
  } catch (error) {
    res.status(500).send(error.message, 'Error delete')
  }
})

export default route
