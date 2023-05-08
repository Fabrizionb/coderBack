/* eslint-disable */
import productModel from "../Dao/models/product.model.js";

class ProductService {
  #model;
  constructor() {
    this.#model =  productModel;
  }
  async find(conditions, options) {
    return this.#model.paginate(conditions, options);
  }
  async getAll() {
    return this.#model.find();
  }
  async findById(_id) {
    return this.#model.findById(_id);
  }
  async create(data) {
    return this.#model.create(data);
  }
  async update(id, data) {
    return this.#model.findOneAndUpdate({_id: id}, data);
  }
  async delete(id) {
    return this.#model.deleteOne({ _id: id });
  }
}

export default ProductService;
