import fs from 'fs'
import { randomUUID } from 'crypto'

// const { throws } = require('assert')

class CartManager {
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

  async #checkCid (cid) {
    try {
      const fileContent = await this.#readFile()
      return fileContent.find((obj) => obj.cid === cid)
    } catch (err) {
      throw new Error(err, 'Error checkCid')
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

  async addCart () {
    try {
      const cid = randomUUID()
      const cartOld = await this.#readFile()
      const cartNew = [...cartOld, { cid, products: [] }]
      const CartStr = JSON.stringify(cartNew)

      const fileExists = await fs.promises.stat(this.filepath).catch(() => false)
      if (!fileExists) {
        throw new Error('File not found')
      }

      await fs.promises.writeFile(this.filepath, CartStr)
      return cid
    } catch (err) {
      throw new Error(err, 'Error addCart')
    }
  }

  async getCartById (cid) {
    const getAll = await this.getAll()
    try {
      const cartFinder = getAll.find(
        (cart) => cart.cid === cid
      )
      return cartFinder
    } catch (err) {
      throw new Error(err, 'Error getProductById')
    }
  }

  async addToCart (cid, data) {
    const cart = await this.getCartById(cid)
    cart.products.push(cid)
  }

  // async updateById (cid, data) {
  //   const cart = await this.getCartById(cid)
  //   const product = await productManager.getById(pid)

  //   const cartOld = this.getAll()
  //   const cartById = await this.getCartById(cid)

  //   const productInCart = cartById.products.find((product) => product.id === data.id)
  //   return productInCart
  // }

  async updateById (cid, data) {
    // Read the file.
    const fileContent = await this.#readFile()

    try {
      // Find the data by id.
      const dataById = await this.getCartById(cid)

      if (dataById) {
        // Write the new object in the file.
        await fs.promises.writeFile(this.path, JSON.stringify(fileContent.map((obj) => obj.id === cid ? { ...obj, ...data } : obj), null, 2))

        // Return the new object.
        return { cid, ...data }
      } else {
        throw new Error(`Error: Not data found with id ${cid}.`)
      }
    } catch (error) {
      throw new Error(`Error: Nottt data found with id ${cid}.`)
    }
  }
}

export default CartManager
