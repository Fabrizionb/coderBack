export default class MongoManager {
  constructor (model) {
    this.model = model
  }

  async find () {
    try {
      const entities = await this.model.find()
      return entities.map((e) => e.toObject())
    } catch (e) {
      console.log(e)
      throw e
    }
  }

  async findOne (_id) {
    try {
      const entity = await this.model.findOne(_id)
      return entity
    } catch (e) {
      console.log(e)
      throw e
    }
  }

  async create (entity) {
    try {
      const newEntity = this.model.create(entity)
      return newEntity
    } catch (e) {
      console.log(e)
      throw e
    }
  }

  async findOneAndUpdate ({ _id }, updateProduct) {
    try {
      // Aca llega el body y el id bien
      const result = await this.model.findOneAndUpdate({ _id }, updateProduct)
      return result
    } catch (e) {
      console.log(e)
      throw e
    }
  }

  async deleteOne (id) {
    try {
      await this.model.deleteOne({ _id: id })
      return id
    } catch (e) {
      console.log(e)
      throw e
    }
  }
}
