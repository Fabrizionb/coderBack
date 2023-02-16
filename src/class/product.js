const { throws } = require('assert')
const fs = require('fs')

class ProductManager {
  static id = 0
  constructor (filepath) {
    this.filepath = filepath
    this.products = []
  }

  async #readFile () {
    try {
      const content = await fs.promises.readFile(this.filepath, 'utf-8')
      const parseContent = JSON.parse(content)
      return parseContent
    } catch (err) {
      console.error('Error catch readFile', err)
    }
  }

  async #checkCode (code) {
    const fileContent = await this.#readFile()
    return fileContent.find((obj) => obj.code === code)
  }

  async getProducts () {
    const fileContent = await this.#readFile()
    try {
      if (fileContent.length === 0) throw new Error('Theres no products')
      else console.log(fileContent)
    } catch (error) {
      console.log('Theres no products')
    }
  }

  async getProductById (id) {
    try {
      const fileContent = await this.#readFile()
      if (!fileContent.find((obj) => obj.id === id)) { throw new Error(`Product with id ${obj.id}  not found`) } else console.log(fileContent.find((obj) => obj.id === id))
    } catch {
      console.log(`Product with id ${id} not found`)
    }
  }

  async updateProduct (id, obj) {
    try {
      const fileContent = await this.#readFile()
      const updated = fileContent.map((product) =>
        product.id === id ? { ...product, ...obj } : product
      )
      if (!fileContent.find((obj) => obj.id === id)) { throw new Error(`product with id ${obj.id} not found`) } else {
        await fs.promises.writeFile(
          this.filepath,
          JSON.stringify(updated, null, 2)
        )
      }
    } catch (err) {
      console.error('Error catch updateProduct')
    }
  }

  async addProduct (title, description, price, image, code, stock) {
    ProductManager.id++
    const product = {
      title,
      description,
      price,
      image,
      code,
      stock,
      id: ProductManager.id
    }

    // if (!title || !description || !price || !image || !code || !stock) {
    //   throw new Error("Parameters cant be empty");
    // }

    // const fileExists = await fs.promises.stat(this.filepath).catch(() => false);
    // if (!fileExists) {
    //   throw new Error("File not found");
    // }

    if (await this.#checkCode(code)) {
      return console.log(`Product with code ${code} found`)
    }

    this.products.push(product)
    await fs.promises.writeFile(this.filepath, JSON.stringify(this.products))
  }

  async deleteProductById (id) {
    if (!id) {
      throw new Error('Id cant be empty')
    }
    const fileExists = await fs.promises.stat(this.filepath).catch(() => false)
    if (!fileExists) {
      throw new Error('File not found')
    }
    const fileContent = await this.#readFile()

    try {
      const productsFiltered = fileContent.filter(
        (product) => product.id !== id
      )
      if (!fileContent.find((obj) => obj.id === id)) { throw new Error(`product with id ${id} not found`) } else {
        await fs.promises.writeFile(
          this.filepath,
          JSON.stringify(productsFiltered, null, 2)
        )
      }
    } catch (err) {
      console.error('Error catch deleteProductById', err)
    }
  }

  async deleteAll () {
    await fs.promises.writeFile(this.filepath, JSON.stringify([]), 'utf-8')
  }
}

module.exports = ProductManager
