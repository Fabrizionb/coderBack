import fs from 'fs'
import path from 'path'
import { v4 as uuidv4 } from 'uuid'

class CartService {
  constructor (filePath = path.resolve(__dirname, '../data/carts.json')) {
    this.filePath = filePath
  }

  async get () {
    const data = await fs.promises.readFile(this.filePath, 'utf-8')
    return JSON.parse(data)
  }

  async getById (_id) {
    const carts = await this.get()
    return carts.find(cart => cart._id === _id)
  }

  async create (data) {
    const carts = await this.get()
    const newCart = { _id: uuidv4(), products: [], ...data }
    carts.push(newCart)
    await this.writeCarts(carts)
    return newCart
  }

  async findOneAndUpdate (query, update) {
    const carts = await this.get()
    const cart = carts.find(cart => cart._id === query._id)
    if (!cart) {
      return null
    }
    Object.assign(cart, update)
    await this.writeCarts(carts)
    return cart
  }
}

export default CartService
