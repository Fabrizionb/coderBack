import { Router } from 'express'
import { multiUploader } from '../utils/multiUploader.js'
// import productManager from '../Dao/controller/product.manager.js'
import productModel from '../Dao/models/product.model.js'
import mongoose from 'mongoose'
import passport from 'passport'
import { authorization } from '../utils/auth.js'
const route = Router()

route.get('/',
  authorization('admin'),
  async (req, res, next) => {
    const baseUrl = 'http://localhost:8080'
    const query = req.query
    const sort = {}
    // Verificar si se ha enviado un parámetro de ordenamiento
    if (query.sort && ['title', 'price'].includes(query.sort)) {
      sort[query.sort] = query.order === 'desc' ? -1 : 1
    }
    // Crear el objeto para la consulta
    const conditions = {}
    if (query.category) {
      conditions.category = query.category
    }
    if (query.status) {
      conditions.status = query.status === 'true'
    }
    try {
      const products = await productModel.paginate(
        conditions,
        {
          page: query.page ?? 1,
          limit: query.limit ?? 10,
          lean: true,
          sort
        }
      )
      if (!products) {
        res.status(404).json({ error: 'Products not found' })
      } else {
        res.status(200).json({
          status: 'success',
          payload: products.docs,
          totalPages: products.totalPages,
          prevPage: products.prev,
          nextPage: products.next,
          page: products.page,
          hasPrevPage: products.hasPrevPage,
          hasNextPage: products.hasNextPage,
          prevLink: products.hasPrevPage ? `${baseUrl}?page=${products.prev}&limit=${products.limit}` : null,
          nextLink: products.hasNextPage ? `${baseUrl}?page=${products.next}&limit=${products.limit}` : null
        }
        )
      }
    } catch (error) {
      next(error)
    }
  // http://localhost:8080/api/products?limit=1
  })

route.get('/:pid',
  passport.authenticate('current', { session: false, failureRedirect: 'api/user/unauthorized' }),
  async (req, res, next) => {
    const { pid } = req.params
    try {
      const isValidObjectId = mongoose.isValidObjectId(pid)
      if (!isValidObjectId) {
        res.status(400).json({ error: 'Invalid Product Id' })
        return
      }
      const product = await productModel.findOne({ _id: pid })
      if (!product) {
        res.status(404).json({ error: `Product with id ${pid} not found` })
        return
      }
      res.status(200).json({ product })
    } catch (error) {
      next(error)
    }
  })

route.post('/', multiUploader,
  passport.authenticate('current', { session: false, failureRedirect: 'api/user/unauthorized' }),
  async (req, res, next) => {
    const product = req.body
    try {
      if (!product) {
        res.status(400).json({ error: 'Product missing' })
        return
      }
      const thumbnails = req.files.map(file => file.filename)
      const newProduct = { ...product, status: true, thumbnails }
      const createdProduct = await productModel.create(newProduct)
      res.status(201).json({ id: createdProduct._id })
    } catch (error) {
      next(error)
    }
  })

route.put('/:id',
  passport.authenticate('current', { session: false, failureRedirect: 'api/user/unauthorized' }),
  async (req, res, next) => {
    const { id } = req.params
    const updateProduct = req.body
    try {
      const productById = await productModel.find({ _id: id })
      if (!productById) res.status(404).json({ error: 'Product not found' })
      const result = await productModel.findOneAndUpdate({ _id: id }, updateProduct)
      res.status(200).json(result)
    } catch (error) {
      next(error)
    }
  })

route.delete('/:pid',
  passport.authenticate('current', { session: false, failureRedirect: 'api/user/unauthorized' }),
  async (req, res, next) => {
    const { pid } = req.params
    try {
      await productModel.deleteOne({ _id: pid })
      res.status(200).json({ message: 'Product deleted successfully' })
    } catch (error) {
      next(error)
    }
  })

export default route
