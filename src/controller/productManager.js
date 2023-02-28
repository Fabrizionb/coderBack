import fs from 'fs'
import { randomUUID } from 'crypto'
/* eslint-disable */
class ProductManager {
  constructor (filepath) {
    this.filepath = filepath
    this.products = []
  }

  async exist (id) {
    const products = await this.readProducts()
    const finder = products.find(prod => prod.id === id)
    return finder
  }

  async readProducts () {
    try {
      const products = await fs.promises.readFile(this.filepath, 'utf-8')
      return JSON.parse(products)
    } catch (error) {
      throw new Error(error.message, 'Error ReadProducts')
    }
  }

  async writeProducts (product) {
    try {
      await fs.promises.writeFile(this.filepath, JSON.stringify(product))
    } catch (error) {
      throw new Error(error.message, 'Error ReadProducts')
    }
  }

  async addProducts (product) {
    try {
      const productsOld = await this.readProducts()
      product.id = randomUUID()
      const productAll = [...productsOld, product]
      await this.writeProducts(productAll)
      return 'Product Added'
    } catch (error) {
      throw new Error(error.message, 'Error writeProducts')
    }
  }

  async getProducts () {
    try {
      return await this.readProducts()
    } catch (error) {
      throw new Error(error.message, 'Error getProducts')
    }
  }

  async getProductsById (id) {
    try {
      const productById = await this.exist(id)
      if (!productById) return 'Product not found'
      return productById
    } catch (error) {
      throw new Error(error.message, 'Error getProductsById')
    }
  }

  async updateProduct (id, product) {
    try {
      let productById = await this.exist(id)
      if (!productById) return 'Product not found'
      await this.deleteProduct(id)
      let productOld = await this.readProducts()
      let products = [{id, ...product }, ...productOld]
      await this.writeProducts(products)
      
    } catch (error) {
      throw new Error(error.message, 'Error updateProduct')
    }
  }

  async deleteProduct (id) {
    try {
      const products = await this.readProducts()
      const existProduct = products.some(prod => prod.id === id)
      if (existProduct) {
        const filterProducts = products.filter(prod => prod.id !== id)
        await this.writeProducts(filterProducts)
        return 'Product delete'
      }
      return 'Product not found'
    } catch (error) {
      throw new Error(error.message, 'Error deleteProduct')
    }
  }
}

export default ProductManager
