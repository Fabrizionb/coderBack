/* eslint-disable */
import ticketModel from "../models/ticket.model.js";


class TicketService {
  #model;
  constructor() {
    this.#model =  ticketModel;
  }
  async find() {
    return this.#model.find();
  }
  async findOne(_id) {
    return this.#model.findById(_id);
  }
  async create(data) {
    return this.#model.create(data);
  }
  async delete(_id) {
    return this.#model.deleteOne(_id);
  }
  async findByCartId(cartId) {
    return this.#model.findOne({ cartId })
      .populate('cartId')
      .populate('purchased_products.product');
}
}

export default TicketService;
