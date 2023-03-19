
export class Model {
  #persistencia
  constructor (persistencia) {
    this.#persistencia = persistencia
  }

  async exist (id) {
    return this.#persistencia.exist(id)
  }

  async readFile () {
    return this.#persistencia.readFile()
  }

  async writeFile (entity) {
    return this.#persistencia.writeFile(entity)
  }

  async addEntity (entity) {
    return this.#persistencia.crear(entity)
  }

  async getEntities () {
    return this.#persistencia.getEntities()
  }

  async getEntityById (id) {
    return this.#persistencia.getEntityById(id)
  }

  async updateEntity (id, entity) {
    return this.#persistencia.updateEntity(id, entity)
  }

  async deleteEntity (id) {
    return this.#persistencia.deleteEntity(id)
  }
}
