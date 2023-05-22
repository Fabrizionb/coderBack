/* eslint-disable */
import TicketService from '../Dao/mongo/ticket.service.mjs'
import DaoFactory from '../Dao/DaoFactory.mjs';
class TicketController {
  #CartService
  #ProductService
  #UserService
  #TicketService

  constructor () {
    this.initializeServices();
  }

  async initializeServices() {
    this.#CartService = await DaoFactory.getDao('cart');
    this.#UserService = await DaoFactory.getDao('user');
    this.#ProductService = await DaoFactory.getDao('product');
    this.#TicketService = await DaoFactory.getDao('ticket');
    
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
  async findTicketsByEmail (req, res, next) {
    const email = req.params.email;
    try {
      const tickets = await this.#TicketService.find({ purchaser: email });
      res.status(200).json({ tickets });
    } catch (error) {
      next(error);
    }
  }

}

const controller = new TicketController()
export default controller
