import fs from 'fs'
import path from 'path'
import { v4 as uuidv4 } from 'uuid'

class TicketService {
  constructor (filePath = path.resolve(__dirname, '../data/tickets.json')) {
    this.filePath = filePath
  }

  async find () {
    const data = await fs.promises.readFile(this.filePath, 'utf-8')
    return JSON.parse(data)
  }

  async findOne (_id) {
    const tickets = await this.find()
    return tickets.find(ticket => ticket._id === _id)
  }

  async create (data) {
    const tickets = await this.find()
    const newTicket = { _id: uuidv4(), ...data }
    tickets.push(newTicket)
    await this.writeTickets(tickets)
    return newTicket
  }

  async delete (_id) {
    let tickets = await this.find()
    const initialLength = tickets.length
    tickets = tickets.filter(ticket => ticket._id !== _id)
    if (initialLength > tickets.length) {
      await this.writeTickets(tickets)
      return { deletedCount: initialLength - tickets.length }
    }
    return { deletedCount: 0 }
  }

  async findByCartId (cartId) {
    const tickets = await this.find()
    return tickets.find(ticket => ticket.cartId === cartId)
  }
}

export default TicketService
