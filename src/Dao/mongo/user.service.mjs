/* eslint-disable */
import userModel from "../models/user.model.js";

class UserService {
  #model;
  constructor() {
    this.#model =  userModel;
  }
  async get () {
    const data = await fs.promises.readFile(this.filePath, 'utf-8')
    return JSON.parse(data)
  }
  async findOne({ email }) {
    return this.#model.findOne({ email });
  }
  async findById(_id) {
    return this.#model.findById(_id).populate('cartId');
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
  async findByCartId(cartId) {
    return this.#model.findOne({ cartId }).populate('cartId');
  }
}

export default UserService;
