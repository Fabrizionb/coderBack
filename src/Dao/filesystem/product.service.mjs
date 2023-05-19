import fs from 'fs'
import path from 'path'
import { v4 as uuidv4 } from 'uuid'

class ProductService {
  constructor (filePath = path.resolve(__dirname, '../data/products.json')) {
    this.filePath = filePath
  }

  async getAll () {
    const data = await fs.promises.readFile(this.filePath, 'utf-8')
    return JSON.parse(data)
  }

  async find (conditions, options) {
    const products = await this.getAll()
    // TODO: Implement filtering
    return products
  }

  async findById (_id) {
    const products = await this.getAll()
    return products.find(product => product._id === _id)
  }

  async create (data) {
    const products = await this.getAll()
    const newProduct = { _id: uuidv4(), ...data }
    products.push(newProduct)
    await this.writeProducts(products)
    return newProduct
  }

  async update (id, data) {
    const products = await this.getAll()
    const product = products.find(product => product._id === id)
    if (!product) {
      return null
    }
    Object.assign(product, data)
    await this.writeProducts(products)
    return product
  }

  async delete (id) {
    const products = await this.getAll()
    const index = products.findIndex(product => product._id === id)
    if (index === -1) {
      return null
    }
    products.splice(index, 1)
    await this.writeProducts(products)
    return { deletedCount: 1 }
  }

  async updateProductStock (id, quantity) {
    const products = await this.getAll()
    const product = products.find(product => product._id === id)
    if (!product || !product.stock) {
      return null
    }
    product.stock -= quantity
    await this.writeProducts(products)
    return product
  }
}

export default ProductService
