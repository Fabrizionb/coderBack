import nodemailer from 'nodemailer'
import config from '../../../data.js'

class CartService {
  #carts = []

  async get () {
    return this.#carts
  }

  async getById (_id) {
    return this.#carts.find(cart => cart._id === _id)
  }

  async create (data) {
    const newCart = { ...data, _id: this.#carts.length + 1 }
    this.#carts.push(newCart)
    return newCart
  }

  async findOneAndUpdate (query, update) {
    const cart = this.#carts.find(cart => cart._id === query._id)
    if (cart) {
      Object.assign(cart, update)
    }
    return cart
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
}

export default CartService
