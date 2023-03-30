/* eslint-disable  */
import { Router } from 'express'
import { multiUploader } from '../utils/multiUploader.js'
import productManager from '../Dao/controller/product.manager.js'
import productModel from '../Dao/models/product.model.js'

const route = Router()

route.get('/', async (req, res, next) => {
  const query = req.query
  try {
    const products = await productModel.paginate(
      {},
      { page: query.page ?? 1, limit: query.limit ?? 10, lean: true },
    );


    res.status(200).json({ products })
  } catch (error) {
    next(error)
  }
  //http://localhost:8080/api/products?limit=1

})

route.get('/:pid', async (req, res, next) => {
  const { pid } = req.params

  try {
    const product = await productManager.findOne({ _id: pid })
    if (!product) {
      res.status(404).json({ error: `Product with id ${pid} not found` })
      return
    }
    res.status(200).json({ product })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

route.post('/', multiUploader, async (req, res, next) => {
  const product = req.body
  try {
    if (!product) {
      res.status(400).json({ error: 'Product missing' })
      return
    }
    const thumbnails = req.files.map(file => file.filename)
    const newProduct = { ...product, status: true, thumbnails }
    const createdProduct = await productManager.create(newProduct)
    res.status(201).json({ id: createdProduct._id })
  } catch (error) {
    next(error)
  }
})

route.put('/:id', async (req, res, next) => {
  // Aca llega el body y el id bien
  const { id } = req.params
  const updateProduct = req.body
  try {
    const productById = await productManager.find({ _id: id })
    if (!productById) res.status(404).json({ error: 'Product not found' })
    const result = await productManager.findOneAndUpdate({ _id: id }, updateProduct)
    res.status(200).json(result)
  } catch (error) {
    next(error)
  }
})

route.delete('/:pid', async (req, res, next) => {
  const { pid } = req.params
  try {
    await productManager.deleteOne({ _id: pid })
    res.status(200).json({ message: 'Product deleted successfully' })
  } catch (error) {
    next(error)
  }
})

export default route
