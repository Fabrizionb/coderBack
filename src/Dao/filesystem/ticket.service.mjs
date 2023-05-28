import fs from 'fs'
import { v4 as uuidv4 } from 'uuid'

class TicketService {
  #dataFile = './data/tickets.json'

  readFromFile () {
    return JSON.parse(fs.readFileSync(this.#dataFile, 'utf8'))
  }

  writeToFile (data) {
    fs.writeFileSync(this.#dataFile, JSON.stringify(data, null, 2))
  }

  find () {
    return this.readFromFile()
  }

  findOne (id) {
    const data = this.readFromFile()
    return data.find(item => item._id === id)
  }

  create (data) {
    const newData = {
      _id: uuidv4(),
      ...data
    }
    const currentData = this.readFromFile()
    currentData.push(newData)
    this.writeToFile(currentData)
    return newData
  }

  delete (id) {
    const currentData = this.readFromFile()
    const updatedData = currentData.filter(item => item._id !== id)
    this.writeToFile(updatedData)
    return { deleted: id }
  }

  findByCartId (cartId) {
    const data = this.readFromFile()
    return data.filter(item => item.cartId === cartId)
  }

  findByEmail (email) {
    const data = this.readFromFile()
    return data.filter(item => item.purchaser === email)
  }

  findByCode (code) {
    const data = this.readFromFile()
    return data.find(item => item.code === code)
  }
}

export default TicketService
