import MongoManager from './mongo.manager.js'
import cartModel from '../models/cart.model.js'

class Carts {
  #persistencia
  constructor (persistencia) {
    this.#persistencia = persistencia
  }

  async find ({ _id }) {
    return this.#persistencia.find({ _id })
  }

  async findOne (_id) {
    return this.#persistencia.findOne(_id)
  }

  async create (cart) {
    return this.#persistencia.create(cart)
  }

  async findOneAndUpdate (id, updateProduct) {
    return this.#persistencia.findOneAndUpdate(id, updateProduct)
  }

  async deleteOne (id) {
    return this.#persistencia.deleteOne(id)
  }
}

const instancia = new Carts(new MongoManager(cartModel))
export default instancia
