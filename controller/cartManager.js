
import fs from 'fs'
import { randomUUID } from 'crypto'
import ProductManager from '../controller/productManager.js'

const productManager = new ProductManager('./data/products.json')
class CartManager {
  constructor (filepath) {
    this.filepath = filepath
  }

  async exist (id) {
    const cart = await this.readCart()
    const finder = cart.find(prod => prod.id === id)
    return finder
  }

  async readCart () {
    try {
      const carts = await fs.promises.readFile(this.filepath, 'utf-8')
      const parsedCarts = JSON.parse(carts)
      if (parsedCarts.length === 0) {
        throw new Error({ err: 'Products not found' })
      } else {
        return parsedCarts
      }
    } catch (error) {
      throw new Error({ error: error.message })
    }
  }

  async writeCart (cart) {
    try {
      await fs.promises.writeFile(this.filepath, JSON.stringify(cart))
    } catch (error) {
      throw new Error({ error: error.message })
    }
  }

  async addCart (cart) {
    try {
      const cartsOld = await this.readCart()
      const id = randomUUID()
      const cartsConcat = [{ id, products: [] }, ...cartsOld]
      await this.writeCart(cartsConcat)
      return cartsConcat
    } catch (error) {
      throw new Error({ error: error.message })
    }
  }

  async getCartById (id) {
    try {
      const cartById = await this.exist(id)
      if (!cartById) {
        throw new Error({ error: 'Cart not found' })
      } else {
        return cartById
      }
    } catch (error) {
      throw new Error({ error: error.message })
    }
  }

  async addProductInCart (cartId, productId) {
    try {
      const cartById = await this.exist(cartId)
      const getCar = await this.readCart()
      if (!cartById) return 'Cart not found'
      const productById = await productManager.exist(productId)
      const cartFilter = await getCar.filter(cart => cart.id !== cartId)
      if (!productById) {
        throw new Error({ error: 'product not found' })
      }

      // Esta el producto, dentro del array ?
      if (cartById.products.some((prod) => prod.id === productId)) {
        const moreProductInCart = cartById.products.find(
          (prod) => prod.id === productId)
        moreProductInCart.quantity++
        const cartsConcat = [cartById, ...cartFilter]
        await this.writeCart(cartsConcat)
        return moreProductInCart
      }

      cartById.products.push({ id: productById.id, quantity: 1 })
      const cartConcat = [cartById, ...cartFilter]
      await this.writeCart(cartConcat)
      return cartConcat
    } catch (error) {
      throw new Error({ error: error.message })
    }
  }
}

export default CartManager
