import MongoManager from './mongo.manager.js'
import chatModel from '../models/chat.model.js'
class Chats {
  #persistencia
  constructor (persistencia) {
    this.#persistencia = persistencia
  }

  async getAll () {
    return this.#persistencia.find()
  }
}

const instancia = new Chats(new MongoManager(chatModel))
export default instancia
