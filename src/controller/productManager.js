import fs from 'fs'
import { randomUUID } from 'crypto'
// import { validateProduct, validarProductPartial } from '../../data/valid.js'

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
      const parsedProducts = JSON.parse(products)
      if (parsedProducts.length === 0) {
        throw new Error({ err: 'Products not found' })
      } else {
        return parsedProducts
      }
    } catch (error) {
      throw new Error({ error: error.message })
    }
  }

  async writeProducts (product) {
    try {
      await fs.promises.writeFile(this.filepath, JSON.stringify(product))
    } catch (error) {
      throw new Error({ error: error.message })
    }
  }

  async addProducts (product) {
    try {
      const productsOld = await this.readProducts()
      product.id = randomUUID()
      product.status = true
      const productAll = [...productsOld, product]
      await this.writeProducts(productAll)
      return 'Product Added'
    } catch (error) {
      throw new Error({ error: error.message })
    }
  }

  async getProducts () {
    try {
      const products = await this.readProducts()
      if (!products) {
        throw new Error({ error: 'Products not found' })
      } else {
        return products
      }
    } catch (error) {
      throw new Error({ error: error.message })
    }
  }

  async getProductsById (id) {
    try {
      const productById = await this.exist(id)
      if (!productById) {
        throw new Error({ error: 'Product not found' })
      } else {
        return productById
      }
    } catch (error) {
      throw new Error({ error: error.message })
    }
  }

  async updateProduct (id, product) {
    try {
      const productById = await this.exist(id)
      if (!productById) {
        throw new Error({ error: 'Product not found' })
      } else {
        await this.deleteProduct(id)
        const productOld = await this.readProducts()
        const products = [{ id, ...product }, ...productOld]
        await this.writeProducts(products)
        return 'Product updated'
      }
    } catch (error) {
      throw new Error({ error: error.message })
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
      } else {
        throw new Error({ error: 'Product not found' })
      }
    } catch (error) {
      throw new Error({ error: error.message })
    }
  }
}

export default ProductManager
