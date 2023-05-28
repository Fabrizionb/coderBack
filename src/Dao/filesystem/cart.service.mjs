import fs from 'fs/promises'
import path from 'path'
import nodemailer from 'nodemailer'
import config from '../../../data.js'

const dataFolder = path.resolve('./data')

class CartService {
  #model
  constructor () {
    this.#model = 'carts.json'
  }

  async get () {
    const data = await fs.readFile(path.join(dataFolder, this.#model))
    return JSON.parse(data)
  }

  async getById (_id) {
    const carts = await this.get()
    return carts.find(cart => cart._id === _id)
  }

  async create (data) {
    const carts = await this.get()
    const newCart = { _id: Date.now().toString(), ...data }
    carts.push(newCart)
    await fs.writeFile(path.join(dataFolder, this.#model), JSON.stringify(carts))
    return newCart
  }

  async findOneAndUpdate (_id, update) {
    const carts = await this.get()
    const cartIndex = carts.findIndex(cart => cart._id === _id)
    if (cartIndex !== -1) {
      carts[cartIndex] = { ...carts[cartIndex], ...update }
      await fs.writeFile(path.join(dataFolder, this.#model), JSON.stringify(carts))
      return carts[cartIndex]
    } else {
      throw new Error(`Cart with id ${_id} not found`)
    }
  }

  async sendPurchaseMail (email) {
    const transporter = nodemailer.createTransport({
      host: 'smtp.gmail.com',
      port: 587,
      auth: {
        user: 'fabrizio1007@gmail.com',
        pass: config.GOOGLE_MAILER
      }
    })

    transporter.sendMail({
      from: "'CoderBack' <proyecto@coderhouse.com>",
      to: email,
      subject: 'Your purchase was successful',
      html: `
        <h1>Thank You, order placed</h1>
        <p class="lead">Your order is currently being prepared.</p>
        <p class="lead">You can find a summary of your purchase in your profile.</p>
        <p class="text-muted">Please log in to view your profile.</p>
        <a href="http://localhost:8080/login" class="btn btn-secondary">Log In</a>
        <p class="text-muted">If you have any questions, our customer service center is available 24/7. Feel free to <a href="http://localhost:8080/chat">contact us</a>.</p>
      `
    })
      .then(info => console.log(info))
      .catch(error => console.log(error))
  }

  async updateCart (cart) {
    return await this.findOneAndUpdate(cart._id, cart)
  }
}

export default CartService
