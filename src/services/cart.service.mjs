/* eslint-disable */
import cartModel from "../Dao/models/cart.model.js";

class CartService {
  #model;
  constructor() {
    this.#model = cartModel;
  }
  async create(data) {
    return this.#model.create(data);
  }
  async find() {
    return this.#model.find();
  }
  async findById(_id) {
    return this.#model.findById(_id).populate('products.product');
  }
  async findOneAndUpdate(query, update) {
    return this.#model.updateOne(query, update);
  }
}

export default CartService;
