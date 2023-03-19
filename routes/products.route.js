// import FileManager from '../controller/fileManager.js'
import { Router } from 'express'
import { validateProduct, validarProductPartial } from '../data/valid.js'
import { userModel as fileManager, userModel } from '../models/user.model.js'
import { multiUploader } from '../utils/multiUploader.js'
import { productModel } from '../models/product.model.js'

const route = Router()
// const fileManager = new FileManager('./data/products.json')

route.get('/', async (req, res) => {
  const { limit } = req.query
  const products = await fileManager.readFile()
  const productsMongoose = await productModel.find()
  console.log('ProductosMongoose desde el get ', productsMongoose)
  try {
    if (!productsMongoose) {
      res.status(404).json({ error: 'Products not found' })
    } else {
      if (!limit) {
        res.status(200).json({ products: productsMongoose })
      } else {
        const limited = productsMongoose.slice(0, limit)
        res.status(200).json({ limited })
      }
    }
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

route.get('/:pid', async (req, res) => {
  const pid = req.params.pid
  try {
    const product = await fileManager.getEntityById(pid)
    if (!product) {
      res.status(404).json({ error: `Product with id ${pid} not found` })
      return
    }
    res.status(200).json({ product })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

route.post('/', multiUploader, async (req, res) => {
  const product = req.body
  // console.log(product)
  const isValid = validateProduct(product)
  const newProduct = { ...product, status: true }

  try {
    if (!isValid) {
      res.status(400).json({ error: 'Invalid Data' })
      return
    }
    if (!product) {
      res.status(400).json({ error: 'Product missing' })
      return
    }
    const thumbnails = req.files.map(file => file.filename) // Map req.files = array
    const idCreated = await fileManager.addEntity({ ...newProduct, thumbnails }) // Producto spread mas array
    res.status(201).json({ id: idCreated })

    const { _id } = await productModel.create(idCreated)
    console.log('idMongoose desde el post', _id)
  } catch (error) {
    res.status(400).json({ error: error.message })
  }
})

route.put('/:id', async (req, res) => {
  const updateProduct = req.body
  const { id, ...productWithoutId } = updateProduct
  try {
    const productById = await fileManager.getEntityById(id)
    const isValid = validarProductPartial(productWithoutId)
    if (!productById) res.status(404).json({ error: 'Product not found' })
    if (!isValid) res.status(404).json({ error: 'Invalid Data' })
    const updatedProduct = await fileManager.updateEntity(id, productWithoutId)
    res.status(200).json(updatedProduct)
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

route.delete('/:pid', async (req, res) => {
  const pid = req.params.pid
  try {
    const product = await fileManager.getEntityById(pid)
    if (!product) {
      res.status(404).json({ error: 'Product not found' })
      return
    }
    await fileManager.deleteEntity(pid)
    res.status(200).json({ message: 'Product deleted successfully' })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

export default route
