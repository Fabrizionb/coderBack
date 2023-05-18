/* eslint-disable */
import TicketService from '../Dao/services/ticket.service.mjs'
class TicketController {
  #TicketService

  constructor (TicketService) {
    this.#TicketService = TicketService
  }

  async create (req, res, next) {
    try {
      const { purchaser, products, amount, cartId } = req.body
      console.log("req.body", req.body)
      const ticketData = {
        amount,
        purchaser,
        cartId: mongoose.Types.ObjectId(cartId),
        purchased_products: products
      }
  
      const ticket = await this.#TicketService.create(ticketData)
  
      console.log('ticket', ticket)
      res.status(200).json({ ticket })
    } catch (error) {
      next(error)
    }
  }

  async findOne (req, res, next) {
    const { tid } = req.params
    try {
      const ticket = await this.#TicketService.findOne({ _id: tid })
      res.status(200).json({ ticket })
    } catch (error) {
      next(error)
    }
  }

  async find (req, res, next) {
    try {
      const tickets = await this.#TicketService.find()
      res.status(200).json({ tickets })
    } catch (error) {
      next(error)
    }
  }

  async delete (req, res, next) {
    const { tid } = req.params
    try {
      await this.#TicketService.delete({ _id: tid })
      res.status(200).json({ message: `Ticket with id ${tid} deleted successfully` })
    } catch (error) {
      next(error)
    }
  }
}

const controller = new TicketController(new TicketService())
export default controller
