import fs from 'fs'
import { randomUUID } from 'crypto'

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

  async getCart () {
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
    const getAll = await this.getCart()
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

  async updateById (cid, pid) {
    const cartFinder = await this.getCartById(cid)
    const objetoEncontrado = cartFinder.products.find(objeto => objeto.id === pid)

    if (objetoEncontrado) {
      objetoEncontrado.quantity += 1
      return
    } else {
      cartFinder.products.push({ id: pid, quantity: 1 })
    }

    console.log(objetoEncontrado.quantity)
    return cartFinder
  }
}

export default CartManager
