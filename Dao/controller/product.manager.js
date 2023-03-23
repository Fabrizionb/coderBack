import MongoManager from './mongo.manager.js'
import productModel from '../models/product.model.js'

class Products {
  #persistencia

  constructor (persistencia) {
    this.#persistencia = persistencia
  }

  async find () {
    return this.#persistencia.find()
  }

  async findOne (_id) {
    return this.#persistencia.findOne(_id)
  }

  async create (product) {
    return this.#persistencia.create(product)
  }

  async findOneAndUpdate (id, updateProduct) {
    return this.#persistencia.findOneAndUpdate(id, updateProduct)
  }

  async deleteOne (id) {
    return this.#persistencia.deleteOne(id)
  }
}

const instancia = new Products(new MongoManager(productModel))
export default instancia
