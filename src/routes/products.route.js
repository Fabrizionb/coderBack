import { Router } from 'express'
import ProductManager from '../class/productManager.js'
import { validateProduct, validarProductPartial } from '../../data/valid.js'

const route = Router()
const productManager = new ProductManager('./data/products.json')

route.get('/', async (req, res) => {
  const { limit } = req.query
  const products = await productManager.getAll()

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
  } catch {
    res.status(500).send('Error reading file')
  }
})

route.get('/:pid', async (req, res) => {
  const pid = req.params.pid
  const cart = await productManager.getById(pid)
  if (!cart) {
    res
      .status(404).send({ error: `cart with id ${pid} not found` })
    return
  }
  res.status(200).send({ cart })
})

route.post('/', async (req, res) => {
  const product = req.body
  const statusProduct = { ...product, status: true }
  const isValid = validateProduct(statusProduct)

  try {
    if (!product) {
      res.status(200).send({ error: 'Product missing' })
      return
    } else if (!isValid) {
      res.status(400).send({ error: 'Invalid Data' })
      return
    } else {
      const idCreated = await productManager.addProduct(statusProduct)
      res.status(201).send({ idCreated })
      return
    }
  } catch {
    res.status(500).send('Error posting product')
  }
})

route.put('/:pid', async (req, res) => {
  const pid = req.params.pid
  const product = await productManager.getById(pid)
  const newData = req.body
  const isValid = validateProduct(newData)

  if (isNaN(pid)) {
    res.status(400).send('Invalid product ID')
    return
  }

  if (!product) {
    res.status(404).send('Product not found')
    return
  }
  if (!isValid) {
    res.status(400).send({ error: 'Invalid Data' })
    return
  }
  await productManager.updateProduct(pid, newData)
  res.send({ ok: true })
})

route.patch('/:pid', async (req, res) => {
  const pid = req.params.pid
  const product = await productManager.getById(pid)
  const newData = req.body
  const isValid = validarProductPartial(newData)

  if (!product) {
    res.status(404).send('Product not found')
    return
  }
  if (!isValid) {
    res.status(400).send({ error: 'Invalid Data' })
    return
  }
  await productManager.updateProduct(pid, newData)
  res.send({ ok: true })
})

route.delete('/:pid', async (req, res) => {
  const pid = req.params.pid
  const product = await productManager.getById(pid)

  if (!product) {
    res.status(404).send('Product not found')
    return
  }

  await productManager.deleteById(pid)
  res.send({ ok: true })
})

export default route
