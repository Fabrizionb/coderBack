/* eslint-disable */
import ticketModel from "../models/ticket.model.js";

class TicketService {
  #model;
  constructor() {
    this.#model = ticketModel;
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
    return this.#model
      .findOne({ cartId })
      .sort({ purchase_datetime: -1 }) // ordenar en orden descendente
      .populate("purchased_products.product");
  }
  async findByEmail(email) {
    return this.#model.find({ purchaser: email });
  }
  async findByCode(code) {
    return this.#model.findOne({ code: code });
  }
}

export default TicketService;
