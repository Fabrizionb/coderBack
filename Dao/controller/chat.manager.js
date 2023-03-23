import MongoManager from './mongo.manager.js'
import chatModel from '../models/chat.model.js'

class Chats {
  #persistencia

  constructor (persistencia) {
    this.#persistencia = persistencia
  }

  async getAll () {
    return this.#persistencia.getAll()
  }

  async create (cart) {
    return this.#persistencia.create(cart)
  }

  async update (id, cart) {
    return this.#persistencia.update(id, cart)
  }

  async delete (id) {
    return this.#persistencia.delete(id)
  }
}

const instancia = new Chats(new MongoManager(chatModel))
export default instancia
