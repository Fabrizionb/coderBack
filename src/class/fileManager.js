import fs from 'fs'
import { randomUUID } from 'crypto'

class FileManager {
  constructor (filePath) {
    this.path = filePath
  }

  // Private method: Read file and return content.
  async #readInfo () {
    try {
      const content = await fs.promises.readFile(this.filepath, 'utf-8')
      const parseContent = JSON.parse(content)
      return parseContent
    } catch (err) {
      throw new Error(err, 'Error ReadFile')
    }
  }

  // Public methods: Get all data from the file.
  async getInfo () {
    const fileContent = await this.#readInfo()

    try {
      if (fileContent.length === 0) throw new Error('Error: Not data found.')
      else return fileContent
    } catch (error) {
      throw new Error('Error: Not data found.')
    }
  }

  // Public methods: Get a data by id.
  async getInfoById (id) {
    const fileContent = await this.#readInfo()

    try {
      const data = fileContent.some((obj) => obj.id === id)

      if (data) {
        const dataById = fileContent.find((obj) => obj.id === id)
        return dataById
      } else {
        throw new Error(`Error: Not data found with id ${id}.`)
      }
    } catch (error) {
      throw new Error(`Error: Not data found with id ${id}.`)
    }
  }

  // Public methods: Post a new data.
  async postInfo (info) {
    const id = randomUUID()
    // Read the file.
    const fileContent = await this.#readInfo()

    try {
      // Create a new object with the
      const newItem = { id, ...info }

      // Write the new object in the file.
      await fs.promises.writeFile(this.path, JSON.stringify([...fileContent, newItem], null, 2))

      // Return the new object.
      return newItem
    } catch (error) {
      throw new Error(`Error saving data: ${error.message}`)
    }
  }

  // Public methods: Update a data by id.
  async updateInfoById (id, data) {
    // Read the file.
    const fileContent = await this.#readInfo()

    try {
      // Find the data by id.
      const dataById = await this.getInfoById(id)

      if (dataById) {
        // Write the new object in the file.
        await fs.promises.writeFile(this.path, JSON.stringify(fileContent.map((obj) => obj.id === id ? { ...obj, ...data } : obj), null, 2))

        // Return the new object.
        return { id, ...data }
      } else {
        throw new Error(`Error: Not data found with id ${id}.`)
      }
    } catch (error) {
      throw new Error(`Error: Not data found with id ${id}.`)
    }
  }

  // Public methods: Delete a data by id.
  async deleteInfoById (id) {
    // Read the file.
    const fileContent = await this.#readInfo()

    try {
      // Find the data by id.
      const dataById = await this.getInfoById(id)

      if (dataById) {
        // Write the new object in the file.
        fs.promises.writeFile(this.path, JSON.stringify(fileContent.filter((obj) => obj.id !== id), null, 2))

        // Return the new object.
        return { id, ...dataById, status: false }
      } else {
        return { error: `Not data found with id ${id}.` }
      }
    } catch (error) {
      throw new Error(`Error deleting data: ${error.message}`)
    }
  }
}

export default FileManager
