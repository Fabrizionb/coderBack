import mongoose from 'mongoose'
// import ProductService from '../Dao/services/product.service.mjs'
import DaoFactory from '../Dao/DaoFactory.mjs'
/* eslint-disable */

class ProductController {
  #CartService
  #ProductService
  #UserService
  #TicketService
  constructor () {
    this.initializeServices();
  }
  async initializeServices() {
    this.#CartService = await DaoFactory.getDao('cart');
    this.#UserService = await DaoFactory.getDao('user');
    this.#ProductService = await DaoFactory.getDao('product');
    this.#TicketService = await DaoFactory.getDao('ticket');
    
  }
  async findAll (req, res, next) {
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
      const products = await this.#ProductService.find(
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
  }
  async findOne (req, res, next) {
    const { pid } = req.params
    try {
      const isValidObjectId = mongoose.isValidObjectId(pid)
      if (!isValidObjectId) {
        res.status(400).json({ error: 'Invalid Product Id' })
        return
      }
      const product = await this.#ProductService.findById({ _id: pid })
      if (!product) {
        res.status(404).json({ error: `Product with id ${pid} not found` })
        return
      }
      res.status(200).json({ product })
    } catch (error) {
      next(error)
    }
  }
  async create (req, res, next) {
    const product = req.body
    try {
      if (!product) {
        res.status(400).json({ error: 'Product missing' })
        return
      }
      const thumbnails = req.files.map(file => file.filename)
      const newProduct = { ...product, status: true, thumbnails }
      const createdProduct = await this.#ProductService.create(newProduct)
      res.status(201).json({ id: createdProduct._id })
    } catch (error) {
      next(error)
    }
  }
  async update (req, res, next) {
    const { id } = req.params
    const updateProduct = req.body
    try {
      const productById = await this.#ProductService.findById({ _id: pid })
      if (!productById) res.status(404).json({ error: 'Product not found' })
      const result = await this.#ProductService.update({ _id: id }, updateProduct)
      res.status(200).json(result)
    } catch (error) {
      next(error)
    }
  }
  async delete (req, res, next) {
    const { pid } = req.params
    try {
      await this.#ProductService.delete({ _id: pid })
      res.status(200).json({ message: 'Product deleted successfully' })
    } catch (error) {
      next(error)
    }
  }
  async updateProductStock (req, res, next) {
    const { pid } = req.params
    const { quantity } = req.body
    try {
      const isValidObjectId = mongoose.isValidObjectId(pid)
      if (!isValidObjectId) {
        res.status(400).json({ error: 'Invalid Product Id' })
        return
      }
      const updatedProduct = await this.#ProductService.updateProductStock(pid, quantity)
      if (!updatedProduct) {
        res.status(404).json({ error: `Product with id ${pid} not found` })
        return
      }
      res.status(200).json({ updatedProduct })
    } catch (error) {
      next(error)
    }
  }
}
const controller = new ProductController()
export default controller
