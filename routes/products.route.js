// import ProductManager from '../controller/productManager.js'
// import { validateProduct, validarProductPartial } from '../data/valid.js'
import { Router } from 'express'
import { multiUploader } from '../utils/multiUploader.js'
import { productModel } from '../models/product.model.js'
// const productManager = new ProductManager('./data/products.json')
const route = Router()

route.get('/', async (req, res) => {
  const { limit, skip, ...query } = req.query

  // const products = await productManager.readProducts()
  try {
    const products = await productModel
      .find(query)
      .skip(Number(skip ?? 0))
      .limit(Number(limit ?? 10))
    res.status(200).json({ products })
    // if (!products) {
    //   res.status(404).json({ error: 'Products not found' })
    // } else {
    //   if (!limit) {
    //     res.status(200).json({ products })
    //   } else {
    //     // const limited = products.slice(0, limit)
    //     const limited = await productModel.find().limit(parseInt(limit))
    //     res.status(200).json({ limited })
    //   }
    // }
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

route.get('/:pid', async (req, res) => {
  const { pid } = req.params

  try {
    // const product = await productManager.getProductsById(pid)
    const product = await productModel.findOne({ _id: pid })
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
  // const isValid = validateProduct(product)

  try {
    // if (!isValid) {
    //   res.status(400).json({ error: 'Invalid Data' })
    //   return
    // }

    if (!product) {
      res.status(400).json({ error: 'Product missing' })
      return
    }
    const thumbnails = req.files.map(file => file.filename)
    const newProduct = { ...product, status: true, thumbnails }
    const createdProduct = await productModel.create(newProduct)
    res.status(201).json({ id: createdProduct._id })
  } catch (error) {
    res.status(400).json({ error: error.message })
  }
})

route.put('/:id', async (req, res) => {
  const { id } = req.params
  const updateProduct = req.body
  try {
    // const productById = await productManager.getProductsById(id)
    const productById = await productModel.find({ _id: id })
    // const isValid = validarProductPartial(productData)
    if (!productById) res.status(404).json({ error: 'Product not found' })
    // if (!isValid) res.status(404).json({ error: 'Invalid Data' })
    // const updatedProduct = await productManager.updateProduct(id, productData)
    const result = await productModel.updateOne({ _id: id }, updateProduct)
    res.status(200).json(result)
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

route.delete('/:pid', async (req, res) => {
  const { pid } = req.params
  try {
    // const productByIdCloud = await productModel.find({ _id: pid })
    // const productByIdLocale = await productManager.getProductsById(pid)
    // if (!productByIdCloud) {
    //   res.status(404).json({ error: 'Product not found in Cloud' })
    //   return
    // }
    // if (!productByIdLocale) {
    //   res.status(404).json({ error: 'Product not found in Locale' })
    //   return
    // }
    // await productManager.deleteProduct(pid)
    await productModel.deleteOne({ _id: pid })
    res.status(200).json({ message: 'Product deleted successfully' })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

export default route
