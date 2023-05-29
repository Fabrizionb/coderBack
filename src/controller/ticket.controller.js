/* eslint-disable */
import TicketService from '../Dao/mongo/ticket.service.mjs'
import DaoFactory from '../Dao/DaoFactory.mjs';
import CustomError from '../errors/custom.error.mjs'

class TicketController {
  #CartService
  #ProductService
  #UserService
  #TicketService

  constructor() {
    this.initializeServices();
  }

  async initializeServices() {
    this.#CartService = await DaoFactory.getDao('cart');
    this.#UserService = await DaoFactory.getDao('user');
    this.#ProductService = await DaoFactory.getDao('product');
    this.#TicketService = await DaoFactory.getDao('ticket');

  }
  async create(req, res, next) {
    try {
      if (!req.body) {
        throw CustomError.createError({
          name: 'Bad Request',
          cause: new Error('Invalid request body'),
          message: 'Invalid request body',
          code: 400,
        })
      }
      const { purchaser, products, amount, cartId } = req.body
      const ticketData = {
        amount,
        purchaser,
        cartId: mongoose.Types.ObjectId(cartId),
        purchased_products: products
      }

      const ticket = await this.#TicketService.create(ticketData)
      if (!ticket) {
        throw CustomError.createError({
          name: 'Error creating ticket',
          cause: new Error(`Failed to create ticket`),
          message: `Failed to create ticket`,
          code: 208,
        })

      }

      res.okResponse({ ticket })
    } catch (error) {
      if (error instanceof CustomError) {
        next(error);
      } else {
        next(CustomError.createError({
          name: 'Server Error',
          cause: error,
          message: `Failed to fetch cart with id ${id}`,
          code: 500,
        }))
      }
    }
  }

  async findOne(req, res, next) {
    const { tid } = req.params
    try {
      const ticket = await this.#TicketService.findOne({ _id: tid })
      if (!ticket) {
        throw CustomError.createError({
          name: 'Not Found',
          cause: new Error(`Cart with id ${tid} not found`),
          message: `Cart with id ${tid} not found`,
          code: 104,
        })

      }
      res.okResponse({ ticket })
    } catch (error) {
      if (error instanceof CustomError) {
        next(error);
      } else {
        next(CustomError.createError({
          name: 'Server Error',
          cause: error,
          message: `Failed to fetch cart with id ${id}`,
          code: 500,
        }))
      }
    }
  }

  async find(req, res, next) {
    try {
      const tickets = await this.#TicketService.find()
      if (!tickets) {
        throw CustomError.createError({
          name: 'Not Found',
          cause: new Error(`Tickets not found`),
          message: `Tickets not found`,
          code: 104,
        })

      }
      res.okResponse({ tickets })
    } catch (error) {
      if (error instanceof CustomError) {
        next(error);
      } else {
        next(CustomError.createError({
          name: 'Server Error',
          cause: error,
          message: `Failed to fetch cart with id ${id}`,
          code: 500,
        }))
      }
    }
  }

  async delete(req, res, next) {
    const { tid } = req.params
    try {
      const newDelete = await this.#TicketService.delete({ _id: tid })
      if (!newDelete) {
        throw CustomError.createError({
          name: 'Error Deleting Ticket',
          cause: new Error(`Failed to delete ticket with id ${tid}`),
          message: `Failed to delete ticket with id ${tid}`,
          code: 210,
        })
      }
      res.okResponse({ message: `Ticket with id ${tid} deleted successfully` })
    } catch (error) {
      if (error instanceof CustomError) {
        next(error);
      } else {
        next(CustomError.createError({
          name: 'Server Error',
          cause: error,
          message: `Failed to fetch cart with id ${id}`,
          code: 500,
        }))
      }
    }
  }
  async findTicketsByEmail(req, res, next) {
    const email = req.params.email;
    try {
      const tickets = await this.#TicketService.find({ purchaser: email });
      if (!tickets) {
        throw CustomError.createError({
          name: 'Not Found',
          cause: new Error(`Tickets not found`),
          message: `Tickets not found`,
          code: 104,
        })

      }
      res.okResponse({ tickets });
    } catch (error) {
      if (error instanceof CustomError) {
        next(error);
      } else {
        next(CustomError.createError({
          name: 'Server Error',
          cause: error,
          message: `Failed to fetch cart with id ${id}`,
          code: 500,
        }))
      }
    }
  }

}

const controller = new TicketController()
export default controller
