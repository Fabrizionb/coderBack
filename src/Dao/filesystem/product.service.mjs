import fs from 'fs/promises'
import path from 'path'

const dataFolder = path.resolve('./data')
class ProductService {
  #model
  constructor () {
    this.#model = 'products.json'
  }

  async getAll () {
    try {
      const data = await fs.readFile(path.join(dataFolder, this.#model))
      return JSON.parse(data)
    } catch (err) {
      console.error('Error reading file:', err)
      return []
    }
  }

  async find (conditions = {}, options = {}) {
    try {
      let products = await this.getAll()

      products = products.filter(product => {
        for (const [key, value] of Object.entries(conditions)) {
          if (product[key] !== value) {
            return false
          }
        }
        return true
      })

      if (options.sort) {
        const sortOrder = options.order === 'desc' ? -1 : 1
        products.sort((a, b) => (a[options.sort] < b[options.sort] ? -1 : 1) * sortOrder)
      }

      if (options.page && options.limit) {
        products = products.slice((options.page - 1) * options.limit, options.page * options.limit)
      }

      return products
    } catch (err) {
      console.error('Error finding products:', err)
      return []
    }
  }

  async findById (_id) {
    const products = await this.getAll()
    return products.find(product => product._id === _id)
  }

  async create (data) {
    const products = await this.getAll()
    const newProduct = { ...data, _id: products.length + 1 }
    products.push(newProduct)
    try {
      await fs.writeFile(path.join(dataFolder, this.#model), JSON.stringify(products, null, 2))
    } catch (err) {
      console.error('Error writing file:', err)
      return null
    }
    return newProduct
  }

  async update (id, data) {
    const products = await this.getAll()
    const index = products.findIndex(product => product._id === id)
    if (index === -1) return null

    products[index] = { ...products[index], ...data }
    try {
      await fs.writeFile(path.join(dataFolder, this.#model), JSON.stringify(products, null, 2))
    } catch (err) {
      console.error('Error writing file:', err)
      return null
    }
    return products[index]
  }

  async delete (id) {
    let products = await this.getAll()
    products = products.filter(product => product._id !== id)
    try {
      await fs.writeFile(path.join(dataFolder, this.#model), JSON.stringify(products, null, 2))
    } catch (err) {
      console.error('Error writing file:', err)
      return null
    }
    return { message: 'Product deleted successfully' }
  }

  async updateProductStock (id, quantity) {
    const products = await this.getAll()
    const product = products.find(product => product._id === id)

    if (!product) {
      console.error(`Product with id ${id} not found.`)
      return null
    }

    if (product.stock < quantity) {
      console.error(`Insufficient stock for product with id ${id}.`)
      return null
    }

    product.stock -= quantity

    try {
      await fs.writeFile(path.join(dataFolder, this.#model), JSON.stringify(products, null, 2))
      return product
    } catch (error) {
      console.error('Error updating product stock:', error)
      return null
    }
  }
}

export default ProductService
