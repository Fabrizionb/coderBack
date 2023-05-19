/* eslint-disable */
import cartModel from "../models/cart.model.js";

class CartService {
  #model;
  constructor() {
    this.#model = cartModel;
  }
  async get() {
    return this.#model.find();
  }
  async getById(_id) {
    return this.#model.findById(_id).populate('products.product');
  }
  async create(data) {
    return this.#model.create(data);
  }
   async findOneAndUpdate(query, update) {
    return this.#model.updateOne(query, update);
  }
}

export default CartService;
