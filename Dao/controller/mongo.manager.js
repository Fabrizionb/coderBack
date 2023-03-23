export default class MongoManager {
  constructor (model) {
    this.model = model
  }

  async find () {
    try {
      const entidades = await this.model.find()
      return entidades.map((e) => e.toObject())
    } catch (e) {
      console.log(e)
      throw e
    }
  }

  async findOne (_id) {
    try {
      const entidad = await this.model.findOne(_id)
      return entidad
    } catch (e) {
      console.log(e)
      throw e
    }
  }

  async create (entidad) {
    try {
      const nuevaEntidad = this.model.create(entidad)
      return nuevaEntidad
    } catch (e) {
      console.log(e)
      throw e
    }
  }

  async findOneAndUpdate ({ _id }, updateProduct) {
    try {
      // Aca llega el body y el id bien
      console.log('updateProduct desde el mongo', updateProduct)
      console.log('id desde el mongo', { _id })
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
