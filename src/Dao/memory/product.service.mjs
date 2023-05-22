/* eslint-disable */
class ProductService {
  #products;

  constructor() {
    this.#products = [];
  }

  async getAll() {
    return this.#products;
  }

  async find(conditions, options) {
    let results = this.#products;
    // Filtrar 
    for (let [key, value] of Object.entries(conditions)) {
      results = results.filter((product) => product[key] === value);
    }
    // Ordenar 
    if (options.sort) {
      const order = options.order === 'desc' ? -1 : 1;
      results.sort((a, b) => {
        if (a[options.sort] < b[options.sort]) {
          return -1 * order;
        } else if (a[options.sort] > b[options.sort]) {
          return 1 * order;
        } else {
          return 0;
        }
      });
    }

    return results;
}
  async findById(_id) {
    return this.#products.find((product) => product._id === _id);
  }

  async create(data) {
    const newProduct = { _id: this.#products.length.toString(), ...data };
    this.#products.push(newProduct);
    return newProduct;
  }

  async update(_id, data) {
    const productIndex = this.#products.findIndex((product) => product._id === _id);
    if (productIndex === -1) {
      return null;
    }
    this.#products[productIndex] = { ...this.#products[productIndex], ...data };
    return this.#products[productIndex];
  }

  async delete(_id) {
    const productIndex = this.#products.findIndex((product) => product._id === _id);
    if (productIndex === -1) {
      return null;
    }
    const deletedProduct = this.#products[productIndex];
    this.#products.splice(productIndex, 1);
    return deletedProduct;
  }

  async updateProductStock(_id, quantity) {
    const productIndex = this.#products.findIndex((product) => product._id === _id);
    if (productIndex === -1) {
      return null;
    }
    const product = this.#products[productIndex];
    product.stock -= quantity;
    return product;
  }
}

export default ProductService;
