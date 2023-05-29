import mongoose from 'mongoose'
// import ProductService from '../Dao/mongo/product.service.mjs'
import CustomError from '../errors/custom.error.mjs'

import DaoFactory from '../Dao/DaoFactory.mjs'
/* eslint-disable */

class ProductController {
  #CartService
  #ProductService
  #UserService
  #TicketService
  constructor() {
    this.initializeServices();
  }
  async initializeServices() {
    this.#CartService = await DaoFactory.getDao('cart');
    this.#UserService = await DaoFactory.getDao('user');
    this.#ProductService = await DaoFactory.getDao('product');
    this.#TicketService = await DaoFactory.getDao('ticket');

  }
  async findAll(req, res, next) {
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
        throw CustomError.createError({
          name: 'Not Found',
          cause: new Error('Products not found'),
          message: 'Products not found',
          code: 104,
        })
      } else {
        res.okResponse({
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
      if (error instanceof CustomError) {
        next(error);
      } else {
        next(CustomError.createError({
          name: 'Server Error',
          cause: error,
          message: 'Failed to fetch products',
          code: 500,
        }))
      }
    }
  }
  async findOne(req, res, next) {
    const { pid } = req.params
    try {
      const isValidObjectId = mongoose.isValidObjectId(pid)
      if (!isValidObjectId) {
        throw CustomError.createError({
          name: 'Bad Request',
          cause: new Error('Invalid Product Id'),
          message: 'Invalid Product Id',
          code: 400,
        })
        return
      }
      const product = await this.#ProductService.findById({ _id: pid })
      if (!product) {
        throw CustomError.createError({
          name: 'Not Found',
          cause: new Error(`Product with id ${pid} not found`),
          message: `Product with id ${pid} not found`,
          code: 104,
        })
      }
      res.okResponse({ product })
    } catch (error) {
      if (error instanceof CustomError) {
        next(error);
      } else {
        next(CustomError.createError({
          name: 'Server Error',
          cause: error,
          message: `Failed to fetch product with id ${pid}`,
          code: 500,
        }))
      }
    }
  }

  //Version con validaciones del create
  async create(req, res, next) {
    const product = req.body
    try {
      if (!product) {
        throw CustomError.createError({
          name: 'Bad Request',
          cause: new Error('Product data missing'),
          message: 'Product data missing',
          code: 400,
        });
      }

      // Props y tipos requeridos
      const requiredProperties = {
        title: 'string',
        price: 'number',
      };

      // comprobar que esten todas y sean del tipo correcto
      const missingOrInvalidProperties = [];
      for (let prop in requiredProperties) {
        if (!product.hasOwnProperty(prop) || typeof product[prop] !== requiredProperties[prop]) {
          missingOrInvalidProperties.push(`${prop} (${requiredProperties[prop]})`);
        }
      }

      // si faltan o son invalidas, tirar error
      if (missingOrInvalidProperties.length > 0) {
        throw CustomError.createError({
          name: 'Bad Request',
          cause: new Error('Required fields missing or invalid'),
          message: `The following properties are required and must be of the correct type: ${missingOrInvalidProperties.join(', ')}`,
          code: 400,
        });
      }

      const thumbnails = req.files ? req.files.map(file => file.filename) : []
      //const thumbnails = []
      const newProduct = { ...product, status: true, thumbnails }
      const createdProduct = await this.#ProductService.create(newProduct)
      if (!createdProduct) {
        throw CustomError.createError({
          name: 'Error Creating Product',
          cause: new Error(`Failed to create product`),
          message: `Failed to create product`,
          code: 208,
        });
      }
      res.okResponse({ id: createdProduct._id })
    } catch (error) {
      if (error instanceof CustomError) {
        next(error);
      } else {
        next(CustomError.createError({
          name: 'Server Error',
          cause: error,
          message: 'Failed to create product',
          code: 500,
        }));
      }
    }
  }

  async update(req, res, next) {
    const { id } = req.params
    const updateProduct = req.body
    if (!updateProduct) {
      throw CustomError.createError({
        name: 'Bad Request',
        cause: new Error('Product missing'),
        message: 'Product missing',
        code: 400,
      });
    }
    try {
      const productById = await this.#ProductService.findById({ _id: pid })
      if (!productById) {
        throw CustomError.createError({
          name: 'Not Found',
          cause: new Error('Product not found'),
          message: 'Product not found',
          code: 104,
        });
      }
      const result = await this.#ProductService.update({ _id: id }, updateProduct)
      if (!result) {
        throw CustomError.createError({
          name: 'Error Updating Product',
          cause: new Error(`Failed to update product with id ${id}`),
          message: `Failed to update product with id ${id}`,
          code: 209,
        })
      }
      res.okResponse(result)
    } catch (error) {
      if (error instanceof CustomError) {
        next(error);
      } else {
        next(CustomError.createError({
          name: 'Server Error',
          cause: error,
          message: `Failed to update product with id ${id}`,
          code: 500,
        }))
      }
    }
  }
  async delete(req, res, next) {
    const { pid } = req.params
    try {
      const result = await this.#ProductService.delete({ _id: pid })
      if (!result) {
        throw CustomError.createError({
          name: 'Error Deleting Product',
          cause: new Error(`Failed to update product with id ${id}`),
          message: `Failed to update product with id ${id}`,
          code: 210,
        })
      }
      res.okResponse({ message: 'Product deleted successfully' })
    } catch (error) {
      if (error instanceof CustomError) {
        next(error);
      } else {
        next(CustomError.createError({
          name: 'Server Error',
          cause: error,
          message: `Failed to delete product with id ${pid}`,
          code: 500,
        }))
      }
    }
  }
  async updateProductStock(req, res, next) {
    const { pid } = req.params
    const { quantity } = req.body
    try {
      const isValidObjectId = mongoose.isValidObjectId(pid)
      if (!isValidObjectId) {
        throw CustomError.createError({
          name: 'Bad Request',
          cause: new Error('Invalid Product Id'),
          message: 'Invalid Product Id',
          code: 400,
        });
        return
      }
      const updatedProduct = await this.#ProductService.updateProductStock(pid, quantity)
      if (!updatedProduct) {
        throw CustomError.createError({
          name: 'Error Updating Stock',
          cause: new Error(`Failed to update stock for product with id ${pid}`),
          message: `Failed to update stock for product with id ${pid}`,
          code: 209,
        });
      }
      res.okResponse({ updatedProduct })
    } catch (error) {
      if (error instanceof CustomError) {
        next(error);
      } else {
        next(CustomError.createError({
          name: 'Server Error',
          cause: error,
          message: `Failed to update stock for product with id ${pid}`,
          code: 500,
        }))
      }
    }
  }
}
const controller = new ProductController()
export default controller
