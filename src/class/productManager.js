import fs from 'fs'
import { randomUUID } from 'crypto'
// const { throws } = require('assert')

class ProductManager {
  constructor (filepath) {
    this.filepath = filepath
    this.products = []
  }

  async #readFile () {
    try {
      const content = await fs.promises.readFile(this.filepath, 'utf-8')
      const parseContent = JSON.parse(content)
      return parseContent
    } catch (err) {
      throw new Error(err, 'Error ReadFile')
    }
  }

  async #checkCode (code) {
    try {
      const fileContent = await this.#readFile()
      return fileContent.find((obj) => obj.code === code)
    } catch (err) {
      throw new Error(err, 'Error checkCode')
    }
  }

  async getAll () {
    const fileContent = await this.#readFile()

    try {
      if (fileContent.length === 0) throw new Error('Theres no products')
      else return fileContent
    } catch (err) {
      throw new Error(err, 'Error getProducts')
    }
  }

  async getProductById (id) {
    const getAll = await this.getAll()
    try {
      const productFinder = getAll.find(
        (product) => product.id === id
      )
      return productFinder
    } catch (err) {
      throw new Error(err, 'Error getProductById')
    }
  }

  async updateProduct (id, obj) {
    try {
      const productFinder = await this.getProductById(id)
      const getAll = await this.getAll()
      if (!productFinder) {
        throw new Error('Product not found')
      }
      const productMod = { ...productFinder, ...obj }
      const productsWithoutProduct = getAll.filter((p) => p.id !== id)
      const newProducts = [...productsWithoutProduct, productMod]
      const productsStr = JSON.stringify(newProducts)
      await fs.promises.writeFile(this.filepath, productsStr)
    } catch (err) {
      throw new Error(err, 'Error updateProduct')
    }
  }

  async addProduct (product) {
    try {
      const id = randomUUID()
      const productsOld = await this.getAll()
      const productsNew = [...productsOld, { id, ...product }]
      const productsStr = JSON.stringify(productsNew)

      if (!product.title || !product.description || !product.price || !product.image || !product.code || !product.stock) {
        throw new Error('Parameters cant be empty')
      }

      const fileExists = await fs.promises.stat(this.filepath).catch(() => false)
      if (!fileExists) {
        throw new Error('File not found')
      }

      if (await this.#checkCode(product.code)) {
        return console.log(`Product with code ${product.code} found`)
      }

      this.products.push(product)
      await fs.promises.writeFile(this.filepath, productsStr)
      return id
    } catch (err) {
      throw new Error(err, 'Error AddProduct')
    }
  }

  async delete (id) {
    try {
      const getAll = await this.getAll()
      const productsWithoutProduct = getAll.filter((p) => p.id !== id)
      const productsStr = JSON.stringify(productsWithoutProduct)
      await fs.promises.writeFile(this.filepath, productsStr)
    } catch (err) {
      throw new Error(err, 'Error deleteProductById')
    }
  }
}

export default ProductManager
