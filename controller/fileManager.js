// import { validateProduct, validarProductPartial } from '../../data/valid.js'
import fs from 'fs'
import { randomUUID } from 'crypto'

export class FileManager {
  constructor (filepath) {
    this.filepath = filepath
    this.products = []
  }

  async exist (id) {
    const entity = await this.readFile()
    const finder = entity.find(prod => prod.id === id)
    return finder
  }

  async readFile () {
    const entities = await fs.promises.readFile(this.filepath, 'utf-8')
    console.log(entities)
    const parsedEntities = JSON.parse(entities)

    console.log(parsedEntities)
    try {
      const entities = await fs.promises.readFile(this.filepath, 'utf-8')
      const parsedEntities = JSON.parse(entities)
      if (parsedEntities.length === 0) {
        throw new Error({ err: 'Entities not found' })
      } else {
        return parsedEntities
      }
    } catch (error) {
      throw new Error({ error: error.message })
    }
  }

  async writeFile (entity) {
    try {
      await fs.promises.writeFile(this.filepath, JSON.stringify(entity))
    } catch (error) {
      throw new Error({ error: error.message })
    }
  }

  async addEntity (entity) {
    try {
      const entityOld = await this.readFile()
      entity.id = randomUUID()
      entity.status = true
      const entityAll = [...entityOld, entity]
      await this.writeFile(entityAll)
      return ({ message: 'Entity Added', entity })
    } catch (error) {
      throw new Error({ error: error.message })
    }
  }

  async getEntities () {
    try {
      const entities = await this.readFile()
      if (!entities) {
        throw new Error({ error: 'Entities not found' })
      } else {
        return entities
      }
    } catch (error) {
      throw new Error({ error: error.message })
    }
  }

  async getEntityById (id) {
    try {
      const entityById = await this.exist(id)
      if (!entityById) {
        return null
      } else {
        return entityById
      }
    } catch (error) {
      throw new Error({ error: error.message })
    }
  }

  async updateEntity (id, entity) {
    try {
      const entityById = await this.exist(id)
      if (!entityById) {
        throw new Error({ error: 'Entity not found' })
      } else {
        await this.deleteEntity(id)
        const entityOld = await this.readFile()
        const entitites = [{ id, ...entity }, ...entityOld]
        await this.writeFile(entitites)
        return 'Entity updated'
      }
    } catch (error) {
      throw new Error({ error: error.message })
    }
  }

  async deleteEntity (id) {
    try {
      const entities = await this.readFile()
      const existEntity = entities.some(ent => ent.id === id)
      if (existEntity) {
        const filterEntities = entities.filter(ent => ent.id !== id)
        await this.writeFile(filterEntities)
        return 'Entity delete'
      } else {
        throw new Error({ error: 'Entity not found' })
      }
    } catch (error) {
      throw new Error({ error: error.message })
    }
  }
}
