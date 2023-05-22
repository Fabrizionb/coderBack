/* eslint-disable */
class MemoryTicketService {
  #tickets;
  constructor() {
    this.#tickets = [];
  }
  async find() {
    return this.#tickets;
  }
  async findOne(_id) {
    return this.#tickets.find(ticket => ticket._id === _id);
  }
  async create(data) {
    const _id = (this.#tickets.length + 1).toString();
    const newTicket = { ...data, _id };
    this.#tickets.push(newTicket);
    return newTicket;
  }
  async delete(_id) {
    const index = this.#tickets.findIndex(ticket => ticket._id === _id);
    if (index !== -1) {
      this.#tickets.splice(index, 1);
      return { deleted: true };
    }
    return { deleted: false };
  }
  async findByCartId(cartId) {
    return this.#tickets
      .filter(ticket => ticket.cartId === cartId)
      .sort((a, b) => b.purchase_datetime - a.purchase_datetime); // ordenar en orden descendente
  }
  async findByEmail(email) {
    return this.#tickets.filter(ticket => ticket.purchaser === email);
  }
  async findByCode(code) {
    return this.#tickets.find(ticket => ticket.code === code);
  }
}

export default MemoryTicketService;

