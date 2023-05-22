
/* eslint-disable */
class UserService {
  #users;
  constructor() {
    this.#users = [];
  }
  async get() {
    return this.#users;
  }
  async findOne({ email }) {
    return this.#users.find(user => user.email === email);
  }
  async findById(_id) {
    return this.#users.find(user => user._id === _id);
  }
  async create(data) {
    data._id = Date.now().toString(); 
    this.#users.push(data);
    return data;
  }
  async update(id, data) {
    const userIndex = this.#users.findIndex(user => user._id === id);
    if (userIndex !== -1) {
      this.#users[userIndex] = { ...this.#users[userIndex], ...data };
      return this.#users[userIndex];
    } else {
      throw new Error(`User with id ${id} not found`);
    }
  }
  async delete(id) {
    const initialLength = this.#users.length;
    this.#users = this.#users.filter(user => user._id !== id);
    if (this.#users.length < initialLength) {
      return { _id: id };
    } else {
      throw new Error(`User with id ${id} not found`);
    }
  }
  async findByCartId(cartId) {
    return this.#users.find(user => user.cartId === cartId);
  }
}

export default UserService;
